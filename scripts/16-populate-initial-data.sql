-- First, let's add the basic categories, tags, and initial tools
-- Categories
INSERT INTO categories (id, name, slug, description, color, icon) VALUES
  (gen_random_uuid(), 'AI & Machine Learning', 'ai-ml', 'Artificial intelligence and machine learning tools', '#8B5CF6', '🤖'),
  (gen_random_uuid(), 'Design', 'design', 'Design and creative tools', '#F59E0B', '🎨'),
  (gen_random_uuid(), 'Development', 'development', 'Developer tools and platforms', '#10B981', '💻'),
  (gen_random_uuid(), 'Marketing', 'marketing', 'Marketing and growth tools', '#EF4444', '📈'),
  (gen_random_uuid(), 'Productivity', 'productivity', 'Productivity and workflow tools', '#3B82F6', '⚡'),
  (gen_random_uuid(), 'Analytics', 'analytics', 'Analytics and data tools', '#6366F1', '📊'),
  (gen_random_uuid(), 'Communication', 'communication', 'Communication and collaboration tools', '#EC4899', '💬'),
  (gen_random_uuid(), 'E-commerce', 'ecommerce', 'E-commerce and sales tools', '#F97316', '🛒')
ON CONFLICT (slug) DO NOTHING;

-- Tags
INSERT INTO tags (id, name, slug) VALUES
  (gen_random_uuid(), 'Free', 'free'),
  (gen_random_uuid(), 'Open Source', 'open-source'),
  (gen_random_uuid(), 'SaaS', 'saas'),
  (gen_random_uuid(), 'API', 'api'),
  (gen_random_uuid(), 'Mobile', 'mobile'),
  (gen_random_uuid(), 'Web App', 'web-app'),
  (gen_random_uuid(), 'Chrome Extension', 'chrome-extension'),
  (gen_random_uuid(), 'Desktop', 'desktop'),
  (gen_random_uuid(), 'Collaboration', 'collaboration'),
  (gen_random_uuid(), 'Automation', 'automation')
ON CONFLICT (slug) DO NOTHING;
