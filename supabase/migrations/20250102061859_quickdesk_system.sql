-- Location: supabase/migrations/20250102061859_quickdesk_system.sql
-- Schema Analysis: Fresh project, no existing schema
-- Integration Type: Complete ticket management system with authentication
-- Dependencies: None (fresh project)

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('admin', 'agent', 'user');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.ticket_category AS ENUM ('technical', 'billing', 'general', 'feature_request', 'bug_report');
CREATE TYPE public.comment_type AS ENUM ('comment', 'status_change', 'assignment_change');

-- Critical intermediary table for PostgREST compatibility
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status public.ticket_status DEFAULT 'open'::public.ticket_status,
    category public.ticket_category NOT NULL,
    upvotes INTEGER DEFAULT 0,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    assigned_agent_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE public.ticket_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    comment_type public.comment_type DEFAULT 'comment'::public.comment_type,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Upvotes table
CREATE TABLE public.ticket_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ticket_id, user_id)
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_assigned_agent_id ON public.tickets(assigned_agent_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_category ON public.tickets(category);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at);
CREATE INDEX idx_ticket_comments_ticket_id ON public.ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_user_id ON public.ticket_comments(user_id);
CREATE INDEX idx_ticket_upvotes_ticket_id ON public.ticket_upvotes(ticket_id);
CREATE INDEX idx_ticket_upvotes_user_id ON public.ticket_upvotes(user_id);

-- 3. Functions for automation
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
BEGIN
    year_part := EXTRACT(year FROM CURRENT_TIMESTAMP)::TEXT;
    
    SELECT COALESCE(MAX(
        CAST(
            SPLIT_PART(ticket_number, '-', 3) AS INTEGER
        )
    ), 0) + 1
    INTO sequence_num
    FROM public.tickets
    WHERE ticket_number LIKE 'TKT-' || year_part || '-%';
    
    RETURN 'TKT-' || year_part || '-' || LPAD(sequence_num::TEXT, 3, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_ticket_modified()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.last_modified = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_comment_modified()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    
    -- Update parent ticket's last_modified when comment is added
    UPDATE public.tickets 
    SET last_modified = CURRENT_TIMESTAMP 
    WHERE id = NEW.ticket_id;
    
    RETURN NEW;
END;
$$;

-- 4. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_ticket_updated
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION public.update_ticket_modified();

CREATE TRIGGER on_comment_updated
    BEFORE UPDATE ON public.ticket_comments
    FOR EACH ROW EXECUTE FUNCTION public.update_comment_modified();

CREATE TRIGGER on_comment_inserted
    AFTER INSERT ON public.ticket_comments
    FOR EACH ROW EXECUTE FUNCTION public.update_comment_modified();

-- 5. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_upvotes ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Pattern 1: Core user table - Simple policies only
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public read, private write for tickets
CREATE POLICY "public_can_read_tickets"
ON public.tickets
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_tickets"
ON public.tickets
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 6A: Role-based access for agents (using auth metadata)
CREATE OR REPLACE FUNCTION public.is_agent_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' IN ('agent', 'admin'))
)
$$;

CREATE POLICY "agents_can_manage_all_tickets"
ON public.tickets
FOR UPDATE
TO authenticated
USING (public.is_agent_or_admin())
WITH CHECK (public.is_agent_or_admin());

-- Pattern 4: Public read, authenticated write for comments
CREATE POLICY "public_can_read_comments"
ON public.ticket_comments
FOR SELECT
TO public
USING (true);

CREATE POLICY "users_manage_own_comments"
ON public.ticket_comments
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 2: Simple user ownership for upvotes
CREATE POLICY "users_manage_own_upvotes"
ON public.ticket_upvotes
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Storage Setup for ticket attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'ticket-attachments',
    'ticket-attachments',
    false,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage RLS Policies
CREATE POLICY "users_view_own_attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'ticket-attachments' AND owner = auth.uid());

CREATE POLICY "users_upload_own_attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'ticket-attachments' 
    AND owner = auth.uid()
);

CREATE POLICY "users_manage_own_attachments"
ON storage.objects
FOR UPDATE, DELETE
TO authenticated
USING (bucket_id = 'ticket-attachments' AND owner = auth.uid())
WITH CHECK (bucket_id = 'ticket-attachments' AND owner = auth.uid());

-- 8. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    agent_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    ticket1_id UUID := gen_random_uuid();
    ticket2_id UUID := gen_random_uuid();
    ticket3_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@quickdesk.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (agent_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'agent@quickdesk.com', crypt('agent123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Support Agent", "role": "agent"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@quickdesk.com', crypt('user123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "End User", "role": "user"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample tickets
    INSERT INTO public.tickets (id, ticket_number, title, description, status, category, user_id, assigned_agent_id, upvotes, created_at, last_modified) VALUES
        (ticket1_id, public.generate_ticket_number(), 'Unable to access dashboard after recent update', 
         'After the latest system update, I am getting a 403 error when trying to access the main dashboard. This is affecting my daily workflow and I need urgent assistance.',
         'open'::public.ticket_status, 'technical'::public.ticket_category, user_uuid, agent_uuid, 12, 
         CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
        
        (ticket2_id, public.generate_ticket_number(), 'Billing discrepancy in monthly invoice',
         'I noticed an incorrect charge on my monthly invoice for services I did not use. The amount seems to be doubled for the premium features subscription.',
         'in_progress'::public.ticket_status, 'billing'::public.ticket_category, user_uuid, agent_uuid, 8,
         CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
         
        (ticket3_id, public.generate_ticket_number(), 'Feature request: Dark mode support',
         'It would be great to have a dark mode option for the application interface. Many users work in low-light environments and this would improve usability significantly.',
         'open'::public.ticket_status, 'feature_request'::public.ticket_category, user_uuid, agent_uuid, 45,
         CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1.5 hours');

    -- Create sample comments
    INSERT INTO public.ticket_comments (ticket_id, user_id, content, comment_type) VALUES
        (ticket1_id, agent_uuid, 'Thanks for reporting this issue. I have escalated it to our technical team and they are investigating the cause.', 'comment'::public.comment_type),
        (ticket1_id, user_uuid, 'Thank you for the quick response. When can I expect this to be resolved?', 'comment'::public.comment_type),
        (ticket2_id, agent_uuid, 'I have reviewed your account and confirmed the billing discrepancy. Processing a refund now.', 'comment'::public.comment_type);

    -- Create sample upvotes
    INSERT INTO public.ticket_upvotes (ticket_id, user_id) VALUES
        (ticket2_id, user_uuid),
        (ticket3_id, user_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;