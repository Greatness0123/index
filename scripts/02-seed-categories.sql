-- Insert initial categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('AI & Machine Learning', 'ai-ml', 'Artificial intelligence and machine learning tools', '🤖', '#8B5CF6'),
('Design', 'design', 'Design and creative tools', '🎨', '#EC4899'),
('Development', 'development', 'Development and coding tools', '💻', '#10B981'),
('Marketing', 'marketing', 'Marketing and growth tools', '📈', '#F59E0B'),
('Productivity', 'productivity', 'Productivity and workflow tools', '⚡', '#3B82F6'),
('Analytics', 'analytics', 'Analytics and data tools', '📊', '#6366F1'),
('Communication', 'communication', 'Communication and collaboration tools', '💬', '#14B8A6'),
('Finance', 'finance', 'Finance and business tools', '💰', '#059669'),
('Education', 'education', 'Learning and educational tools', '📚', '#DC2626'),
('E-commerce', 'ecommerce', 'E-commerce and sales tools', '🛒', '#7C3AED')
ON CONFLICT (slug) DO NOTHING;
