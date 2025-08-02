import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadFile(file, folder = 'general') {
    const user = await supabase?.auth?.getUser()
    if (!user?.data?.user) throw new Error('Not authenticated')

    const fileExt = file?.name?.split('.')?.pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${user?.data?.user?.id}/${folder}/${fileName}`

    const { data, error } = await supabase?.storage?.from('ticket-attachments')?.upload(filePath, file, {
        upsert: false
      })

    if (error) throw error

    return {
      path: data?.path,
      fullPath: data?.fullPath,
      publicUrl: supabase?.storage?.from('ticket-attachments')?.getPublicUrl(data?.path)?.data?.publicUrl
    };
  },

  async deleteFile(filePath) {
    const { error } = await supabase?.storage?.from('ticket-attachments')?.remove([filePath])

    if (error) throw error
  },

  async getFileUrl(filePath) {
    const { data } = supabase?.storage?.from('ticket-attachments')?.getPublicUrl(filePath)

    return data?.publicUrl;
  },

  async getUserFiles(folder = '') {
    const user = await supabase?.auth?.getUser()
    if (!user?.data?.user) throw new Error('Not authenticated')

    const userFolder = `${user?.data?.user?.id}/${folder}`
    
    const { data, error } = await supabase?.storage?.from('ticket-attachments')?.list(userFolder, {
        limit: 100,
        offset: 0
      })

    if (error) throw error
    return data || []
  }
}