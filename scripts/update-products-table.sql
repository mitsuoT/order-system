-- 商品テーブルに新しいカラムを追加
-- Add new columns to products table

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pack_size INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 既存データに初期値を設定
-- Set initial values for existing data
UPDATE products SET 
  cost_price = unit_price * 0.7,  -- 原価を売価の70%として設定
  pack_size = 1,
  image_url = '/placeholder.svg?height=100&width=100'
WHERE cost_price = 0;

-- 新しいサンプルデータで更新
-- Update with new sample data
UPDATE products SET 
  cost_price = 100.00, 
  pack_size = 1, 
  image_url = '/placeholder.svg?height=100&width=100&text=キャベツ'
WHERE code = 'V001';

UPDATE products SET 
  cost_price = 80.00, 
  pack_size = 5, 
  image_url = '/placeholder.svg?height=100&width=100&text=人参'
WHERE code = 'V002';

UPDATE products SET 
  cost_price = 70.00, 
  pack_size = 10, 
  image_url = '/placeholder.svg?height=100&width=100&text=玉ねぎ'
WHERE code = 'V003';

UPDATE products SET 
  cost_price = 2000.00, 
  pack_size = 1, 
  image_url = '/placeholder.svg?height=100&width=100&text=牛肉'
WHERE code = 'M001';

UPDATE products SET 
  cost_price = 1300.00, 
  pack_size = 1, 
  image_url = '/placeholder.svg?height=100&width=100&text=豚肉'
WHERE code = 'M002';

UPDATE products SET 
  cost_price = 900.00, 
  pack_size = 1, 
  image_url = '/placeholder.svg?height=100&width=100&text=鶏肉'
WHERE code = 'M003';

UPDATE products SET 
  cost_price = 900.00, 
  pack_size = 1, 
  image_url = '/placeholder.svg?height=100&width=100&text=サーモン'
WHERE code = 'S001';

UPDATE products SET 
  cost_price = 2800.00, 
  pack_size = 1, 
  image_url = '/placeholder.svg?height=100&width=100&text=マグロ'
WHERE code = 'S002';

UPDATE products SET 
  cost_price = 1800.00, 
  pack_size = 1, 
  image_url = '/placeholder.svg?height=100&width=100&text=エビ'
WHERE code = 'S003';

-- インデックス追加
-- Add indexes
CREATE INDEX IF NOT EXISTS idx_products_cost_price ON products(cost_price);
CREATE INDEX IF NOT EXISTS idx_products_pack_size ON products(pack_size);
