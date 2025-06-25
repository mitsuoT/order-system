-- 会社マスター
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(13) UNIQUE NOT NULL,
  name VARCHAR(40) NOT NULL,
  name_kana VARCHAR(15),
  email VARCHAR(40),
  phone VARCHAR(13),
  address VARCHAR(80),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 商品マスター
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(13) UNIQUE NOT NULL,
  name VARCHAR(36) NOT NULL,
  name_jp VARCHAR(36),
  name_kr VARCHAR(36),
  price DECIMAL(10,2) DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(4) DEFAULT '',
  category VARCHAR(20),
  description TEXT,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 受注マスター
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_no VARCHAR(8) UNIQUE NOT NULL,
  order_date DATE NOT NULL,
  delivery_date DATE,
  customer_code VARCHAR(13) NOT NULL,
  customer_name VARCHAR(40),
  department_code VARCHAR(6) DEFAULT '000000',
  staff_code VARCHAR(13) DEFAULT '0000000000000',
  total_amount DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 受注明細
CREATE TABLE order_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_code VARCHAR(13) NOT NULL,
  product_name VARCHAR(36),
  quantity DECIMAL(9,4) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 10.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- トピックマスター
CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  title_jp VARCHAR(100),
  title_kr VARCHAR(100),
  content TEXT NOT NULL,
  content_jp TEXT,
  content_kr TEXT,
  category VARCHAR(20) DEFAULT 'general',
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  target_audience VARCHAR(20) DEFAULT 'both', -- 'wholesale', 'restaurant', 'both'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 受注番号シーケンス管理
CREATE TABLE order_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  last_number INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(year)
);

-- インデックス作成
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_orders_customer ON orders(customer_code);
CREATE INDEX idx_topics_category ON topics(category);
CREATE INDEX idx_topics_active ON topics(is_active);
