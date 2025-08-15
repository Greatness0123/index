-- Replace emoji icons with Lucide React icon names
UPDATE categories SET icon = 'Bot' WHERE slug = 'ai-ml';
UPDATE categories SET icon = 'Palette' WHERE slug = 'design';
UPDATE categories SET icon = 'Code' WHERE slug = 'development';
UPDATE categories SET icon = 'TrendingUp' WHERE slug = 'marketing';
UPDATE categories SET icon = 'Zap' WHERE slug = 'productivity';
UPDATE categories SET icon = 'BarChart' WHERE slug = 'analytics';
UPDATE categories SET icon = 'MessageCircle' WHERE slug = 'communication';
UPDATE categories SET icon = 'DollarSign' WHERE slug = 'finance';
UPDATE categories SET icon = 'GraduationCap' WHERE slug = 'education';
UPDATE categories SET icon = 'ShoppingCart' WHERE slug = 'ecommerce';
