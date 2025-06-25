-- 取引関係管理用サンプルデータ投入
-- Insert sample data for partnership management

-- 卸会社データ / Wholesale Company Data
INSERT INTO wholesale_companies (code, name, name_ko, contact_person, phone, email, address, description, product_categories, status) VALUES
('WS001', '東京食材卸', '도쿄식자재도매', '佐藤太郎', '03-1111-2222', 'sato@tokyo-foods.jp', '東京都中央区築地1-1-1', '新鮮な魚介類と野菜を中心に取り扱う老舗卸会社', ARRAY['seafood', 'vegetables'], 'active'),
('WS002', '関西肉類卸売', '간사이육류도매', '田中花子', '06-3333-4444', 'tanaka@kansai-meat.jp', '大阪府大阪市中央区1-2-3', '高品質な国産肉を専門に扱う卸会社', ARRAY['meat'], 'active'),
('WS003', '九州農産物流通', '규슈농산물유통', '山田次郎', '092-5555-6666', 'yamada@kyushu-agri.jp', '福岡県福岡市博多区2-3-4', '九州産の新鮮な野菜と果物を全国に配送', ARRAY['vegetables', 'grains'], 'active'),
('WS004', '北海道乳業卸', '홋카이도유업도매', '鈴木三郎', '011-7777-8888', 'suzuki@hokkaido-dairy.jp', '北海道札幌市中央区3-4-5', '北海道産の新鮮な乳製品を専門に扱う', ARRAY['dairy'], 'active'),
('WS005', '全国調味料商事', '전국조미료상사', '高橋四郎', '03-9999-0000', 'takahashi@seasoning.jp', '東京都江東区4-5-6', '全国の調味料を幅広く取り扱う専門商社', ARRAY['condiments'], 'active');

-- 飲食店データ / Restaurant Data
INSERT INTO restaurants (code, name, name_ko, contact_person, phone, email, address, business_type, status) VALUES
('REST001', 'レストラン田中', '다나카 레스토랑', '田中太郎', '03-1234-5678', 'tanaka@restaurant.jp', '東京都渋谷区1-1-1', 'restaurant', 'active'),
('REST002', 'カフェ山田', '야마다 카페', '山田花子', '03-2345-6789', 'yamada@cafe.jp', '東京都新宿区2-2-2', 'cafe', 'active'),
('REST003', '韓国料理店김씨', '김씨 한국요리점', '김철수', '03-3456-7890', 'kim@korean.jp', '東京都池袋区3-3-3', 'restaurant', 'active'),
('REST004', 'イタリアンロッソ', '로쏘 이탈리안', '佐藤次郎', '03-4567-8901', 'sato@rosso.jp', '東京都品川区4-4-4', 'restaurant', 'active'),
('REST005', '中華楼王', '왕 중화루', '王小明', '03-5678-9012', 'wang@chinese.jp', '東京都台東区5-5-5', 'restaurant', 'active');

-- 取引関係データ / Partnership Data
INSERT INTO partnerships (wholesale_company_id, restaurant_id, status, request_date, approval_date, request_message) VALUES
-- 承認済みの取引関係
((SELECT id FROM wholesale_companies WHERE code = 'WS001'), (SELECT id FROM restaurants WHERE code = 'REST001'), 'approved', '2024-01-01', '2024-01-02', '新鮮な魚介類の仕入れを希望します'),
((SELECT id FROM wholesale_companies WHERE code = 'WS001'), (SELECT id FROM restaurants WHERE code = 'REST002'), 'approved', '2024-01-03', '2024-01-04', 'カフェメニュー用の野菜を定期的に仕入れたいです'),
((SELECT id FROM wholesale_companies WHERE code = 'WS002'), (SELECT id FROM restaurants WHERE code = 'REST003'), 'approved', '2024-01-05', '2024-01-06', '韓国料理に適した高品質な肉類を希望します'),
((SELECT id FROM wholesale_companies WHERE code = 'WS002'), (SELECT id FROM restaurants WHERE code = 'REST004'), 'approved', '2024-01-07', '2024-01-08', 'イタリアン料理用の上質な肉を仕入れたいです'),

-- 申請中の取引関係
((SELECT id FROM wholesale_companies WHERE code = 'WS003'), (SELECT id FROM restaurants WHERE code = 'REST001'), 'pending', '2024-01-10', NULL, '九州産の新鮮な野菜を仕入れたいです'),
((SELECT id FROM wholesale_companies WHERE code = 'WS004'), (SELECT id FROM restaurants WHERE code = 'REST002'), 'pending', '2024-01-12', NULL, 'カフェメニュー用の北海道産乳製品を希望します'),

-- 拒否された取引関係
((SELECT id FROM wholesale_companies WHERE code = 'WS005'), (SELECT id FROM restaurants WHERE code = 'REST005'), 'rejected', '2024-01-08', '2024-01-09', '中華料理用の調味料を仕入れたいです');

-- 取引実績サマリーデータ / Partnership Performance Data
INSERT INTO partnership_performance (partnership_id, total_orders, total_amount, last_order_date, first_order_date, average_order_amount) VALUES
((SELECT id FROM partnerships WHERE wholesale_company_id = (SELECT id FROM wholesale_companies WHERE code = 'WS001') AND restaurant_id = (SELECT id FROM restaurants WHERE code = 'REST001')), 25, 125000.00, '2024-01-15', '2024-01-02', 5000.00),
((SELECT id FROM partnerships WHERE wholesale_company_id = (SELECT id FROM wholesale_companies WHERE code = 'WS001') AND restaurant_id = (SELECT id FROM restaurants WHERE code = 'REST002')), 18, 89000.00, '2024-01-14', '2024-01-04', 4944.44),
((SELECT id FROM partnerships WHERE wholesale_company_id = (SELECT id FROM wholesale_companies WHERE code = 'WS002') AND restaurant_id = (SELECT id FROM restaurants WHERE code = 'REST003')), 12, 156000.00, '2024-01-13', '2024-01-06', 13000.00),
((SELECT id FROM partnerships WHERE wholesale_company_id = (SELECT id FROM wholesale_companies WHERE code = 'WS002') AND restaurant_id = (SELECT id FROM restaurants WHERE code = 'REST004')), 8, 98000.00, '2024-01-11', '2024-01-08', 12250.00);

-- 既存のcustomersテーブルとrestaurantsテーブルを関連付け
-- Link existing customers table with restaurants table
UPDATE customers SET 
    restaurant_id = (SELECT id FROM restaurants WHERE restaurants.code = customers.code),
    business_type = 'restaurant'
WHERE EXISTS (SELECT 1 FROM restaurants WHERE restaurants.code = customers.code);
