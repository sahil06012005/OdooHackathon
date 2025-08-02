import { supabase } from '../lib/supabase';

export const authService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase?.auth?.getUser()
    return user
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()
    
    if (error) throw error
    return data
  },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single()
    
    if (error) throw error
    return data
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase?.auth?.signOut()
    if (error) throw error
  },

  async resetPassword(email) {
    const { data, error } = await supabase?.auth?.resetPasswordForEmail(email, {
      redirectTo: `${window.location?.origin}/reset-password`
    })
    
    if (error) throw error
    return data
  }
}