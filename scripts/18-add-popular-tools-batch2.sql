-- Add second batch of 25 popular tools
WITH category_ids AS (
  SELECT 
    (SELECT id FROM categories WHERE slug = 'ai-ml' LIMIT 1) as ai_id,
    (SELECT id FROM categories WHERE slug = 'design' LIMIT 1) as design_id,
    (SELECT id FROM categories WHERE slug = 'development' LIMIT 1) as dev_id,
    (SELECT id FROM categories WHERE slug = 'marketing' LIMIT 1) as marketing_id,
    (SELECT id FROM categories WHERE slug = 'productivity' LIMIT 1) as productivity_id,
    (SELECT id FROM categories WHERE slug = 'analytics' LIMIT 1) as analytics_id,
    (SELECT id FROM categories WHERE slug = 'communication' LIMIT 1) as comm_id,
    (SELECT id FROM categories WHERE slug = 'ecommerce' LIMIT 1) as ecom_id
)

INSERT INTO tools (id, name, description, url, image_url, pricing, rating, rating_count, is_featured, is_approved, category_id) VALUES
  -- More AI Tools
  (gen_random_uuid(), 'Jasper', 'AI writing assistant for marketing content', 'https://jasper.ai', '/placeholder.svg?height=64&width=64', 'Paid', 4.4, 8920, false, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'Copy.ai', 'AI-powered copywriting tool', 'https://copy.ai', '/placeholder.svg?height=64&width=64', 'Freemium', 4.3, 7650, false, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'Runway ML', 'AI-powered creative tools for video and images', 'https://runwayml.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.5, 6780, false, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'Replicate', 'Platform for running machine learning models', 'https://replicate.com', '/placeholder.svg?height=64&width=64', 'Pay-per-use', 4.4, 4320, false, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'Hugging Face', 'Platform for machine learning models and datasets', 'https://huggingface.co', '/placeholder.svg?height=64&width=64', 'Freemium', 4.6, 9870, false, true, (SELECT ai_id FROM category_ids)),
  
  -- More Design Tools
  (gen_random_uuid(), 'Framer', 'Interactive design and prototyping tool', 'https://framer.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.5, 7890, false, true, (SELECT design_id FROM category_ids)),
  (gen_random_uuid(), 'InVision', 'Digital product design platform', 'https://invisionapp.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.2, 6540, false, true, (SELECT design_id FROM category_ids)),
  (gen_random_uuid(), 'Adobe XD', 'User experience design software', 'https://adobe.com/xd', '/placeholder.svg?height=64&width=64', 'Freemium', 4.3, 8760, false, true, (SELECT design_id FROM category_ids)),
  (gen_random_uuid(), 'Principle', 'Animated design tool for Mac', 'https://principleformac.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.4, 3210, false, true, (SELECT design_id FROM category_ids)),
  (gen_random_uuid(), 'Affinity Designer', 'Professional graphic design software', 'https://affinity.serif.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.6, 5670, false, true, (SELECT design_id FROM category_ids)),
  
  -- More Development Tools
  (gen_random_uuid(), 'JetBrains IntelliJ', 'Integrated development environment for Java', 'https://jetbrains.com/idea', '/placeholder.svg?height=64&width=64', 'Freemium', 4.7, 14320, false, true, (SELECT dev_id FROM category_ids)),
  (gen_random_uuid(), 'Sublime Text', 'Sophisticated text editor for code', 'https://sublimetext.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.5, 9870, false, true, (SELECT dev_id FROM category_ids)),
  (gen_random_uuid(), 'GitLab', 'DevOps platform with Git repository management', 'https://gitlab.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.4, 11230, false, true, (SELECT dev_id FROM category_ids)),
  (gen_random_uuid(), 'Netlify', 'Platform for deploying and hosting web applications', 'https://netlify.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.5, 8940, false, true, (SELECT dev_id FROM category_ids)),
  (gen_random_uuid(), 'Firebase', 'Google platform for mobile and web applications', 'https://firebase.google.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.4, 16780, false, true, (SELECT dev_id FROM category_ids)),
  
  -- More Marketing Tools
  (gen_random_uuid(), 'ConvertKit', 'Email marketing for creators', 'https://convertkit.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.5, 6780, false, true, (SELECT marketing_id FROM category_ids)),
  (gen_random_uuid(), 'Klaviyo', 'Email and SMS marketing platform', 'https://klaviyo.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.4, 8920, false, true, (SELECT marketing_id FROM category_ids)),
  (gen_random_uuid(), 'Semrush', 'SEO and digital marketing toolkit', 'https://semrush.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.3, 12340, false, true, (SELECT marketing_id FROM category_ids)),
  (gen_random_uuid(), 'Ahrefs', 'SEO toolset for growing search traffic', 'https://ahrefs.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.6, 9870, false, true, (SELECT marketing_id FROM category_ids)),
  (gen_random_uuid(), 'Moz', 'SEO software and data to grow traffic', 'https://moz.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.2, 7650, false, true, (SELECT marketing_id FROM category_ids)),
  
  -- More Productivity Tools
  (gen_random_uuid(), 'Todoist', 'Task management and to-do list app', 'https://todoist.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.4, 13450, false, true, (SELECT productivity_id FROM category_ids)),
  (gen_random_uuid(), 'Evernote', 'Note-taking and organization app', 'https://evernote.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.1, 18920, false, true, (SELECT productivity_id FROM category_ids)),
  (gen_random_uuid(), 'OneNote', 'Digital note-taking app by Microsoft', 'https://onenote.com', '/placeholder.svg?height=64&width=64', 'Free', 4.3, 15670, false, true, (SELECT productivity_id FROM category_ids)),
  (gen_random_uuid(), 'Obsidian', 'Knowledge management and note-taking app', 'https://obsidian.md', '/placeholder.svg?height=64&width=64', 'Freemium', 4.7, 8760, false, true, (SELECT productivity_id FROM category_ids)),
  (gen_random_uuid(), 'RescueTime', 'Time tracking and productivity analytics', 'https://rescuetime.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.2, 5430, false, true, (SELECT productivity_id FROM category_ids)),
  
  -- Analytics Tools
  (gen_random_uuid(), 'Mixpanel', 'Product analytics platform', 'https://mixpanel.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.4, 7890, false, true, (SELECT analytics_id FROM category_ids));
