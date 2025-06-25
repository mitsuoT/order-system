-- サンプル商品データ
INSERT INTO products (code, name, name_jp, name_kr, price, cost, unit, category, stock_quantity) VALUES
('PROD001', 'Premium Rice', '高級米', '프리미엄 쌀', 2500.00, 1800.00, 'kg', 'grain', 100),
('PROD002', 'Fresh Vegetables', '新鮮野菜', '신선 야채', 800.00, 600.00, 'pack', 'vegetable', 50),
('PROD003', 'Soy Sauce', '醤油', '간장', 450.00, 300.00, 'bottle', 'seasoning', 200),
('PROD004', 'Miso Paste', '味噌', '된장', 650.00, 450.00, 'pack', 'seasoning', 80),
('PROD005', 'Kimchi', 'キムチ', '김치', 1200.00, 900.00, 'pack', 'pickle', 30),
('PROD006', 'Green Tea', '緑茶', '녹차', 1800.00, 1200.00, 'pack', 'beverage', 60),
('PROD007', 'Ramen Noodles', 'ラーメン', '라면', 180.00, 120.00, 'pack', 'noodle', 300),
('PROD008', 'Seaweed', '海苔', '김', 350.00, 250.00, 'pack', 'seaweed', 150);

-- サンプル会社データ
INSERT INTO companies (code, name, name_kana, email, phone, address) VALUES
('COMP001', 'Tokyo Restaurant', 'トウキョウレストラン', 'info@tokyo-rest.jp', '03-1234-5678', '東京都渋谷区1-1-1'),
('COMP002', 'Seoul Kitchen', 'ソウルキッチン', 'contact@seoul-kitchen.kr', '02-9876-5432', 'ソウル市江南区2-2-2'),
('COMP003', 'Osaka Wholesale', 'オオサカホールセール', 'sales@osaka-wholesale.jp', '06-5555-1111', '大阪府大阪市3-3-3');

-- サンプルトピックデータ
INSERT INTO topics (title, title_jp, title_kr, content, content_jp, content_kr, category, priority, target_audience) VALUES
('New Product Launch', '新商品発売', '신제품 출시', 'We are excited to announce our new premium rice product.', '高級米の新商品を発売いたします。', '프리미엄 쌀 신제품을 출시합니다.', 'product', 1, 'both'),
('Seasonal Menu Update', '季節メニュー更新', '계절 메뉴 업데이트', 'Spring seasonal menu items are now available.', '春の季節メニューをご用意いたしました。', '봄 계절 메뉴를 준비했습니다.', 'menu', 2, 'restaurant'),
('Wholesale Price Update', '卸売価格更新', '도매 가격 업데이트', 'Updated wholesale pricing effective from next month.', '来月より卸売価格を更新いたします。', '다음 달부터 도매 가격을 업데이트합니다.', 'pricing', 1, 'wholesale');

-- 受注番号シーケンス初期化
INSERT INTO order_sequences (year, last_number) VALUES (2024, 0);
