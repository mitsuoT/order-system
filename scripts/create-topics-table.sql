-- トピック管理テーブル
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    wholesale_company_id INTEGER REFERENCES wholesale_companies(id),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('news', 'promotion', 'maintenance', 'announcement')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    publish_date DATE NOT NULL,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_topics_wholesale_company ON topics(wholesale_company_id);
CREATE INDEX idx_topics_publish_date ON topics(publish_date);
CREATE INDEX idx_topics_category ON topics(category);
CREATE INDEX idx_topics_priority ON topics(priority);
CREATE INDEX idx_topics_active ON topics(is_active);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_topics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_topics_updated_at();
