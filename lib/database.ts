import { createClient } from "@supabase/supabase-js"

// Fallback values for development/preview
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

// Create client with error handling
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

// Check if we're using demo/fallback values
export const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export type Product = {
  id: string
  code: string
  name: string
  name_jp?: string
  name_kr?: string
  price: number
  cost: number
  unit: string
  category: string
  description?: string
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  order_no: string
  order_date: string
  delivery_date?: string
  customer_code: string
  customer_name?: string
  department_code: string
  staff_code: string
  total_amount: number
  tax_amount: number
  status: string
  created_at: string
  updated_at: string
}

export type OrderDetail = {
  id: string
  order_id: string
  product_code: string
  product_name?: string
  quantity: number
  unit_price: number
  amount: number
  tax_rate: number
  created_at: string
}

export type Topic = {
  id: string
  title: string
  title_jp?: string
  title_kr?: string
  content: string
  content_jp?: string
  content_kr?: string
  category: string
  priority: number
  is_active: boolean
  target_audience: string
  created_at: string
  updated_at: string
}
