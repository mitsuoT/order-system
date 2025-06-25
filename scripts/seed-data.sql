-- サンプルデータ投入
-- Insert sample data

-- 商品データ / Product Data
INSERT INTO products (code, name, category, unit_price, stock, unit) VALUES
('V001', 'キャベツ / 양배추', 'vegetables', 150.00, 50, 'kg'),
('V002', '人参 / 당근', 'vegetables', 120.00, 30, 'kg'),
('V003', '玉ねぎ / 양파', 'vegetables', 100.00, 40, 'kg'),
('M001', '牛肉 / 소고기', 'meat', 2800.00, 20, 'kg'),
('M002', '豚肉 / 돼지고기', 'meat', 1800.00, 25, 'kg'),
('M003', '鶏肉 / 닭고기', 'meat', 1200.00, 30, 'kg'),
('S001', 'サーモン / 연어', 'seafood', 1200.00, 15, 'kg'),
('S002', 'マグロ / 참치', 'seafood', 3500.00, 10, 'kg'),
('S003', 'エビ / 새우', 'seafood', 2200.00, 12, 'kg'),
('D001', '牛乳 / 우유', 'dairy', 180.00, 100, 'liter'),
('D002', 'チーズ / 치즈', 'dairy', 800.00, 20, 'kg'),
('G001', '米 / 쌀', 'grains', 450.00, 200, 'kg'),
('G002', '小麦粉 / 밀가루', 'grains', 280.00, 150, 'kg'),
('C001', '醤油 / 간장', 'condiments', 320.00, 50, 'liter'),
('C002', '味噌 / 된장', 'condiments', 450.00, 30, 'kg');

-- 得意先データ / Customer Data
INSERT INTO customers (code, name, name_ko, contact_person, phone, email, address) VALUES
('REST001', 'レストラン田中', '다나카 레스토랑', '田中太郎', '03-1234-5678', 'tanaka@restaurant.jp', '東京都渋谷区1-1-1'),
('REST002', 'カフェ山田', '야마다 카페', '山田花子', '03-2345-6789', 'yamada@cafe.jp', '東京都新宿区2-2-2'),
('REST003', '韓国料理店김씨', '김씨 한국요리점', '김철수', '03-3456-7890', 'kim@korean.jp', '東京都池袋区3-3-3'),
('REST004', 'イタリアンロッソ', '로쏘 이탈리안', '佐藤次郎', '03-4567-8901', 'sato@rosso.jp', '東京都品川区4-4-4'),
('REST005', '中華楼王', '왕 중화루', '王小明', '03-5678-9012', 'wang@chinese.jp', '東京都台東区5-5-5');

-- サンプル注文データ / Sample Order Data
INSERT INTO orders (order_number, customer_id, order_date, status, total_amount, remarks) VALUES
('ORD001', (SELECT id FROM customers WHERE code = 'REST001'), '2024-01-15', 'pending', 4500.00, '急ぎの注文'),
('ORD002', (SELECT id FROM customers WHERE code = 'REST002'), '2024-01-14', 'confirmed', 1800.00, '定期注文'),
('ORD003', (SELECT id FROM customers WHERE code = 'REST003'), '2024-01-13', 'shipped', 3200.00, 'キムチ用材料');

-- 注文明細データ / Order Item Data
INSERT INTO order_items (order_id, product_id, product_code, product_name, quantity, unit_price, amount) VALUES
-- ORD001の明細
((SELECT id FROM orders WHERE order_number = 'ORD001'), (SELECT id FROM products WHERE code = 'V001'), 'V001', 'キャベツ / 양배추', 10.000, 150.00, 1500.00),
((SELECT id FROM orders WHERE order_number = 'ORD001'), (SELECT id FROM products WHERE code = 'M001'), 'M001', '牛肉 / 소고기', 1.000, 2800.00, 2800.00),
((SELECT id FROM orders WHERE order_number = 'ORD001'), (SELECT id FROM products WHERE code = 'C001'), 'C001', '醤油 / 간장', 0.625, 320.00, 200.00),

-- ORD002の明細
((SELECT id FROM orders WHERE order_number = 'ORD002'), (SELECT id FROM products WHERE code = 'S001'), 'S001', 'サーモン / 연어', 1.500, 1200.00, 1800.00),

-- ORD003の明細
((SELECT id FROM orders WHERE order_number = 'ORD003'), (SELECT id FROM products WHERE code = 'V001'), 'V001', 'キャベツ / 양배추', 8.000, 150.00, 1200.00),
((SELECT id FROM orders WHERE order_number = 'ORD003'), (SELECT id FROM products WHERE code = 'V002'), 'V002', '人参 / 당근', 5.000, 120.00, 600.00),
((SELECT id FROM orders WHERE order_number = 'ORD003'), (SELECT id FROM products WHERE code = 'M002'), 'M002', '豚肉 / 돼지고기', 0.778, 1800.00, 1400.00);
