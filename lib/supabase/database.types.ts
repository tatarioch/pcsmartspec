export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string
          brand: string | null
          model: string | null
          cpu: string | null
          ram_gb: string | null
          ram_type: string | null
          ram_speed_mhz: string | null
          storage: Json | null
          gpu: string | null
          display_resolution: string | null
          screen_size_inch: number | null
          os: string | null
          status: 'draft' | 'published' | 'sold'
          images: string[] | null
          created_at: string
          updated_at: string | null
          user_id: string
          price: number | null
          description: string | null
        }
        Insert: {
          id?: string
          brand?: string | null
          model?: string | null
          cpu?: string | null
          ram_gb?: string | null
          ram_type?: string | null
          ram_speed_mhz?: string | null
          storage?: Json | null
          gpu?: string | null
          display_resolution?: string | null
          screen_size_inch?: number | null
          os?: string | null
          status?: 'draft' | 'published' | 'sold'
          images?: string[] | null
          created_at?: string
          updated_at?: string | null
          user_id: string
          price?: number | null
          description?: string | null
        }
        Update: {
          id?: string
          brand?: string | null
          model?: string | null
          cpu?: string | null
          ram_gb?: string | null
          ram_type?: string | null
          ram_speed_mhz?: string | null
          storage?: Json | null
          gpu?: string | null
          display_resolution?: string | null
          screen_size_inch?: number | null
          os?: string | null
          status?: 'draft' | 'published' | 'sold'
          images?: string[] | null
          created_at?: string
          updated_at?: string | null
          user_id?: string
          price?: number | null
          description?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
