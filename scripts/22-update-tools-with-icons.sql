-- Update existing tools with proper logo URLs from popular tools
-- This script adds real logo URLs for existing tools in the database

-- Update tools with actual logo URLs
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' WHERE name ILIKE '%chatgpt%' OR name ILIKE '%openai%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' WHERE name ILIKE '%figma%';
UPDATE tools SET image_url = 'https://code.visualstudio.com/assets/images/code-stable.png' WHERE name ILIKE '%visual studio code%' OR name ILIKE '%vscode%';
UPDATE tools SET image_url = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' WHERE name ILIKE '%github%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg' WHERE name ILIKE '%typescript%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' WHERE name ILIKE '%react%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg' WHERE name ILIKE '%next.js%' OR name ILIKE '%nextjs%';
UPDATE tools SET image_url = 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg' WHERE name ILIKE '%tailwind%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg' WHERE name ILIKE '%laravel%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' WHERE name ILIKE '%python%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' WHERE name ILIKE '%javascript%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' WHERE name ILIKE '%node.js%' OR name ILIKE '%nodejs%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg' WHERE name ILIKE '%postgresql%' OR name ILIKE '%postgres%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/6/62/MySQL.svg/1200px-MySQL.svg.png' WHERE name ILIKE '%mysql%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg' WHERE name ILIKE '%mongodb%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/f/fd/JQuery-Logo.svg' WHERE name ILIKE '%jquery%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/4/47/React_Native_Logo.png' WHERE name ILIKE '%react native%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/1/17/Google-flutter-logo.png' WHERE name ILIKE '%flutter%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Dart-logo.png' WHERE name ILIKE '%dart%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/c/ca/AngularJS_logo.svg' WHERE name ILIKE '%angular%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg' WHERE name ILIKE '%vue%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg' WHERE name ILIKE '%svelte%';
UPDATE tools SET image_url = 'https://seeklogo.com/images/N/nuxt-logo-5EF50E1ABD-seeklogo.com.png' WHERE name ILIKE '%nuxt%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Notion-logo.svg' WHERE name ILIKE '%notion%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' WHERE name ILIKE '%notion%';
UPDATE tools SET image_url = 'https://logos-world.net/wp-content/uploads/2021/08/Trello-Logo.png' WHERE name ILIKE '%trello%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Slack_Technologies_Logo.svg' WHERE name ILIKE '%slack%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Adobe_XD_CC_icon.svg' WHERE name ILIKE '%adobe xd%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg' WHERE name ILIKE '%illustrator%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg' WHERE name ILIKE '%photoshop%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg' WHERE name ILIKE '%premiere%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg' WHERE name ILIKE '%after effects%';
UPDATE tools SET image_url = 'https://cdn.worldvectorlogo.com/logos/discord-6.svg' WHERE name ILIKE '%discord%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' WHERE name ILIKE '%telegram%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' WHERE name ILIKE '%whatsapp%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' WHERE name ILIKE '%facebook%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg' WHERE name ILIKE '%twitter%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' WHERE name ILIKE '%linkedin%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' WHERE name ILIKE '%instagram%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg' WHERE name ILIKE '%youtube%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg' WHERE name ILIKE '%chrome%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg' WHERE name ILIKE '%firefox%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg' WHERE name ILIKE '%safari%';
UPDATE tools SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg' WHERE name ILIKE '%edge%';

-- Update tools with generic placeholder for tools without specific logos
UPDATE tools 
SET image_url = CONCAT('/placeholder.svg?height=48&width=48&query=', REPLACE(name, ' ', '%20'), '%20logo')
WHERE image_url IS NULL OR image_url = '';

-- Add some popular AI tools with their logos
INSERT INTO tools (name, description, url, image_url, category_id, pricing, rating, rating_count, is_featured, approved) VALUES
('Midjourney', 'AI-powered image generation tool for creating stunning artwork and designs', 'https://midjourney.com', 'https://cdn.sanity.io/images/4zrzovbb/website/1c2dcbcbde8b91c34a130e2e67dc0c8e8a9e8a7e-1024x1024.png', 
 (SELECT id FROM categories WHERE name = 'AI & Machine Learning'), 'Paid', 4.8, 15420, true, true),
('Claude', 'Advanced AI assistant by Anthropic for conversations, analysis, and creative tasks', 'https://claude.ai', 'https://claude.ai/images/claude_app_icon.png',
 (SELECT id FROM categories WHERE name = 'AI & Machine Learning'), 'Freemium', 4.7, 8930, true, true),
('Stable Diffusion', 'Open-source AI model for generating images from text descriptions', 'https://stability.ai', 'https://stability.ai/favicon.ico',
 (SELECT id FROM categories WHERE name = 'AI & Machine Learning'), 'Free', 4.6, 12340, false, true);

-- Log the update
SELECT 'Updated tools with logo URLs' as status;
