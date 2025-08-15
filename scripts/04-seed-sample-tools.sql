-- Insert sample tools
WITH category_ids AS (
  SELECT id, slug FROM categories
),
tag_ids AS (
  SELECT id, slug FROM tags
)
INSERT INTO tools (name, description, url, image_url, category_id, is_approved, is_featured, pricing, rating, rating_count) 
SELECT 
  'ChatGPT',
  'AI-powered conversational assistant that can help with writing, coding, analysis, and creative tasks.',
  'https://chat.openai.com',
  '/placeholder.svg?height=200&width=200',
  (SELECT id FROM category_ids WHERE slug = 'ai-ml'),
  true,
  true,
  'freemium',
  4.8,
  15420
UNION ALL
SELECT 
  'Figma',
  'Collaborative design tool for creating user interfaces, prototypes, and design systems.',
  'https://figma.com',
  '/placeholder.svg?height=200&width=200',
  (SELECT id FROM category_ids WHERE slug = 'design'),
  true,
  true,
  'freemium',
  4.7,
  8930
UNION ALL
SELECT 
  'GitHub',
  'Version control and collaboration platform for software development projects.',
  'https://github.com',
  '/placeholder.svg?height=200&width=200',
  (SELECT id FROM category_ids WHERE slug = 'development'),
  true,
  true,
  'freemium',
  4.9,
  12340
UNION ALL
SELECT 
  'Notion',
  'All-in-one workspace for notes, tasks, wikis, and databases.',
  'https://notion.so',
  '/placeholder.svg?height=200&width=200',
  (SELECT id FROM category_ids WHERE slug = 'productivity'),
  true,
  false,
  'freemium',
  4.6,
  9870
UNION ALL
SELECT 
  'Canva',
  'Easy-to-use design platform for creating graphics, presentations, and marketing materials.',
  'https://canva.com',
  '/placeholder.svg?height=200&width=200',
  (SELECT id FROM category_ids WHERE slug = 'design'),
  true,
  false,
  'freemium',
  4.5,
  11200;
