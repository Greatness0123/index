-- Add first batch of 25 popular tools
WITH category_ids AS (
  SELECT id as ai_id FROM categories WHERE slug = 'ai-ml' LIMIT 1
), design_ids AS (
  SELECT id as design_id FROM categories WHERE slug = 'design' LIMIT 1
), dev_ids AS (
  SELECT id as dev_id FROM categories WHERE slug = 'development' LIMIT 1
), marketing_ids AS (
  SELECT id as marketing_id FROM categories WHERE slug = 'marketing' LIMIT 1
), productivity_ids AS (
  SELECT id as productivity_id FROM categories WHERE slug = 'productivity' LIMIT 1
)

INSERT INTO tools (id, name, description, url, image_url, pricing, rating, rating_count, is_featured, is_approved, category_id) VALUES
  -- AI Tools
  (gen_random_uuid(), 'ChatGPT', 'Advanced AI chatbot for conversations, writing, and problem-solving', 'https://chat.openai.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.8, 15420, true, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'Claude', 'AI assistant by Anthropic for analysis, writing, and coding', 'https://claude.ai', '/placeholder.svg?height=64&width=64', 'Freemium', 4.7, 8930, true, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'Midjourney', 'AI image generation tool for creating stunning artwork', 'https://midjourney.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.9, 12340, true, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'GitHub Copilot', 'AI-powered code completion and programming assistant', 'https://github.com/features/copilot', '/placeholder.svg?height=64&width=64', 'Paid', 4.6, 9870, true, true, (SELECT ai_id FROM category_ids)),
  (gen_random_uuid(), 'Stable Diffusion', 'Open-source AI image generation model', 'https://stability.ai', '/placeholder.svg?height=64&width=64', 'Free', 4.5, 7650, false, true, (SELECT ai_id FROM category_ids)),
  
  -- Design Tools
  (gen_random_uuid(), 'Figma', 'Collaborative interface design tool', 'https://figma.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.8, 18920, true, true, (SELECT design_id FROM design_ids)),
  (gen_random_uuid(), 'Adobe Photoshop', 'Professional image editing software', 'https://adobe.com/photoshop', '/placeholder.svg?height=64&width=64', 'Paid', 4.7, 25430, true, true, (SELECT design_id FROM design_ids)),
  (gen_random_uuid(), 'Canva', 'Easy-to-use graphic design platform', 'https://canva.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.6, 22100, true, true, (SELECT design_id FROM design_ids)),
  (gen_random_uuid(), 'Sketch', 'Digital design toolkit for Mac', 'https://sketch.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.5, 8760, false, true, (SELECT design_id FROM design_ids)),
  (gen_random_uuid(), 'Adobe Illustrator', 'Vector graphics and illustration software', 'https://adobe.com/illustrator', '/placeholder.svg?height=64&width=64', 'Paid', 4.7, 15680, false, true, (SELECT design_id FROM design_ids)),
  
  -- Development Tools
  (gen_random_uuid(), 'Visual Studio Code', 'Free source-code editor by Microsoft', 'https://code.visualstudio.com', '/placeholder.svg?height=64&width=64', 'Free', 4.9, 32450, true, true, (SELECT dev_id FROM dev_ids)),
  (gen_random_uuid(), 'GitHub', 'Web-based version control and collaboration platform', 'https://github.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.8, 28900, true, true, (SELECT dev_id FROM dev_ids)),
  (gen_random_uuid(), 'Vercel', 'Platform for frontend frameworks and static sites', 'https://vercel.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.7, 12340, true, true, (SELECT dev_id FROM dev_ids)),
  (gen_random_uuid(), 'Docker', 'Platform for developing, shipping, and running applications', 'https://docker.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.6, 18760, false, true, (SELECT dev_id FROM dev_ids)),
  (gen_random_uuid(), 'Postman', 'API platform for building and using APIs', 'https://postman.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.5, 15230, false, true, (SELECT dev_id FROM dev_ids)),
  
  -- Marketing Tools
  (gen_random_uuid(), 'Mailchimp', 'Email marketing and automation platform', 'https://mailchimp.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.4, 19870, true, true, (SELECT marketing_id FROM marketing_ids)),
  (gen_random_uuid(), 'HubSpot', 'Inbound marketing, sales, and service platform', 'https://hubspot.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.6, 16540, true, true, (SELECT marketing_id FROM marketing_ids)),
  (gen_random_uuid(), 'Google Analytics', 'Web analytics service by Google', 'https://analytics.google.com', '/placeholder.svg?height=64&width=64', 'Free', 4.5, 24320, false, true, (SELECT marketing_id FROM marketing_ids)),
  (gen_random_uuid(), 'Buffer', 'Social media management platform', 'https://buffer.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.3, 11290, false, true, (SELECT marketing_id FROM marketing_ids)),
  (gen_random_uuid(), 'Hootsuite', 'Social media management and scheduling', 'https://hootsuite.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.2, 13450, false, true, (SELECT marketing_id FROM marketing_ids)),
  
  -- Productivity Tools
  (gen_random_uuid(), 'Notion', 'All-in-one workspace for notes, tasks, and collaboration', 'https://notion.so', '/placeholder.svg?height=64&width=64', 'Freemium', 4.7, 21890, true, true, (SELECT productivity_id FROM productivity_ids)),
  (gen_random_uuid(), 'Slack', 'Business communication platform', 'https://slack.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.5, 26780, true, true, (SELECT productivity_id FROM productivity_ids)),
  (gen_random_uuid(), 'Trello', 'Visual project management tool', 'https://trello.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.4, 18920, false, true, (SELECT productivity_id FROM productivity_ids)),
  (gen_random_uuid(), 'Asana', 'Team collaboration and project management', 'https://asana.com', '/placeholder.svg?height=64&width=64', 'Freemium', 4.3, 15670, false, true, (SELECT productivity_id FROM productivity_ids)),
  (gen_random_uuid(), 'Monday.com', 'Work operating system for teams', 'https://monday.com', '/placeholder.svg?height=64&width=64', 'Paid', 4.4, 12340, false, true, (SELECT productivity_id FROM productivity_ids));
