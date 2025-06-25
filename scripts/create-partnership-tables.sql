-- 取引関係管理用テーブル作成
-- Create tables for partnership management

-- 卸会社マスタ / Wholesale Company Master
CREATE TABLE IF NOT EXISTS wholesale_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_ko VARCHAR(200),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    description TEXT,
    product_categories TEXT[], -- 取扱カテゴリー配列
    status VARCHAR(20) DEFAULT 'active', -- active, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 飲食店マスタ / Restaurant Master  
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_ko VARCHAR(200),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    business_type VARCHAR(50), -- restaurant, cafe, hotel, etc.
    status VARCHAR(20) DEFAULT 'active', -- active, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 取引関係マスタ / Partnership Master
CREATE TABLE IF NOT EXISTS partnerships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wholesale_company_id UUID REFERENCES wholesale_companies(id),
    restaurant_id UUID REFERENCES restaurants(id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, active, inactive
    request_date DATE DEFAULT CURRENT_DATE,
    approval_date DATE,
    request_message TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(wholesale_company_id, restaurant_id)
);

-- 取引実績サマリー / Partnership Performance Summary
CREATE TABLE IF NOT EXISTS partnership_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partnership_id UUID REFERENCES partnerships(id),
    total_orders INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    last_order_date DATE,
    first_order_date DATE,
    average_order_amount DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成 / Create Indexes
CREATE INDEX IF NOT EXISTS idx_wholesale_companies_code ON wholesale_companies(code);
CREATE INDEX IF NOT EXISTS idx_wholesale_companies_status ON wholesale_companies(status);
CREATE INDEX IF NOT EXISTS idx_restaurants_code ON restaurants(code);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON restaurants(status);
CREATE INDEX IF NOT EXISTS idx_partnerships_wholesale_id ON partnerships(wholesale_company_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_restaurant_id ON partnerships(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_status ON partnerships(status);
CREATE INDEX IF NOT EXISTS idx_partnership_performance_partnership_id ON partnership_performance(partnership_id);

-- 既存のcustomersテーブルを更新してrestaurantsテーブルと統合
-- Update existing customers table to integrate with restaurants table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES restaurants(id),
ADD COLUMN IF NOT EXISTS business_type VARCHAR(50) DEFAULT 'restaurant';

-- 既存の注文テーブルに卸会社IDを追加
-- Add wholesale company ID to existing orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS wholesale_company_id UUID REFERENCES wholesale_companies(id);
