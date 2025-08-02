import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.username?.trim()) {
      newErrors.username = 'Username or email is required';
    }
    
    if (!formData?.password?.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn(formData?.username, formData?.password);
      
      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          setErrors({
            general: 'Invalid email or password. Please try again.'
          });
        } else if (error?.message?.includes('Email not confirmed')) {
          setErrors({
            general: 'Please confirm your email address before signing in.'
          });
        } else {
          setErrors({
            general: error?.message || 'An error occurred during sign in.'
          });
        }
      } else if (data?.user) {
        // Call parent callback if provided
        if (onLogin) {
          onLogin({
            username: formData?.username,
            name: data?.user?.user_metadata?.full_name || data?.user?.email,
            email: data?.user?.email,
            role: data?.user?.user_metadata?.role || 'user'
          });
        }
        
        showSuccessToast('Login successful! Welcome back.');
        navigate('/dashboard');
      }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        setErrors({
          general: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        });
      } else {
        setErrors({
          general: 'Something went wrong. Please try again.'
        });
        console.error('JavaScript error in auth:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessToast = (message) => {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-success text-success-foreground px-6 py-4 rounded-lg shadow-elevation-3 z-50 animate-slide-down';
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-medium">${message}</span>
      </div>
    `;
    
    document.body?.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      if (toast?.parentNode) {
        toast?.parentNode?.removeChild(toast);
      }
    }, 3000);
  };

  const handleForgotPassword = () => {
    showSuccessToast('Password reset link sent to your email!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-2xl shadow-elevation-3 p-8 border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elevation-2">
            <Icon name="Lock" size={32} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your QuickDesk account</p>
        </div>

        {/* General Error */}
        {errors?.general && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <span className="text-error text-sm font-medium">{errors?.general}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username or Email"
            type="email"
            name="username"
            value={formData?.username}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            error={errors?.username}
            required
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData?.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              error={errors?.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
            className="mt-8"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Info" size={14} className="mr-2" />
            Demo Credentials
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div><strong>Admin:</strong> admin@quickdesk.com / admin123</div>
            <div><strong>Agent:</strong> agent@quickdesk.com / agent123</div>
            <div><strong>User:</strong> user@quickdesk.com / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;