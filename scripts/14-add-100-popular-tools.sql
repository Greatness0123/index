-- Add 96 more popular tools to reach 100 total (4 existing + 96 new)

-- AI & Machine Learning Tools
INSERT INTO tools (name, description, url, category_id, pricing_model, logo_url, screenshot_urls, featured, approved) VALUES
('Midjourney', 'AI-powered image generation tool that creates stunning artwork from text prompts', 'https://midjourney.com', 1, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Claude', 'Advanced AI assistant by Anthropic for conversations, analysis, and creative tasks', 'https://claude.ai', 1, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Stable Diffusion', 'Open-source AI model for generating images from text descriptions', 'https://stability.ai', 1, 'free', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Runway ML', 'AI-powered creative tools for video editing, image generation, and more', 'https://runwayml.com', 1, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Jasper AI', 'AI writing assistant for marketing copy, blog posts, and content creation', 'https://jasper.ai', 1, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Copy.ai', 'AI-powered copywriting tool for marketing and sales content', 'https://copy.ai', 1, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Perplexity', 'AI-powered search engine that provides accurate answers with sources', 'https://perplexity.ai', 1, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Character.AI', 'Platform for creating and chatting with AI characters', 'https://character.ai', 1, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Design Tools
('Adobe Photoshop', 'Industry-standard photo editing and digital art software', 'https://adobe.com/photoshop', 2, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Sketch', 'Digital design platform for creating user interfaces and experiences', 'https://sketch.com', 2, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Adobe Illustrator', 'Vector graphics software for logos, icons, and illustrations', 'https://adobe.com/illustrator', 2, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Canva', 'Easy-to-use graphic design platform for social media, presentations, and more', 'https://canva.com', 2, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Framer', 'Interactive design tool for creating high-fidelity prototypes and websites', 'https://framer.com', 2, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Adobe XD', 'UX/UI design and prototyping tool for web and mobile apps', 'https://adobe.com/xd', 2, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('InVision', 'Digital product design platform for prototyping and collaboration', 'https://invisionapp.com', 2, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Procreate', 'Digital illustration app for iPad with natural drawing experience', 'https://procreate.art', 2, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Development Tools
('Visual Studio Code', 'Free source code editor with debugging and Git integration', 'https://code.visualstudio.com', 3, 'free', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('GitHub', 'Web-based platform for version control and collaborative software development', 'https://github.com', 3, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Vercel', 'Platform for frontend frameworks and static sites with global CDN', 'https://vercel.com', 3, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Netlify', 'Platform for deploying and hosting modern web applications', 'https://netlify.com', 3, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Docker', 'Platform for developing, shipping, and running applications in containers', 'https://docker.com', 3, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Postman', 'API development environment for testing and documenting APIs', 'https://postman.com', 3, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Firebase', 'Google platform for building mobile and web applications', 'https://firebase.google.com', 3, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Supabase', 'Open source Firebase alternative with PostgreSQL database', 'https://supabase.com', 3, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Marketing Tools
('HubSpot', 'Inbound marketing, sales, and service platform', 'https://hubspot.com', 4, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Mailchimp', 'Email marketing platform for small businesses', 'https://mailchimp.com', 4, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Hootsuite', 'Social media management platform for scheduling and analytics', 'https://hootsuite.com', 4, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Buffer', 'Social media management tool for scheduling posts and analytics', 'https://buffer.com', 4, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('ConvertKit', 'Email marketing platform designed for creators and bloggers', 'https://convertkit.com', 4, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Klaviyo', 'Email and SMS marketing platform for e-commerce businesses', 'https://klaviyo.com', 4, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Semrush', 'Digital marketing toolkit for SEO, PPC, and content marketing', 'https://semrush.com', 4, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Ahrefs', 'SEO toolset for backlink analysis and keyword research', 'https://ahrefs.com', 4, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Productivity Tools
('Trello', 'Visual project management tool using boards, lists, and cards', 'https://trello.com', 5, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Asana', 'Work management platform for teams to organize and track projects', 'https://asana.com', 5, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Monday.com', 'Work operating system for managing projects and workflows', 'https://monday.com', 5, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Todoist', 'Task management app for organizing personal and professional projects', 'https://todoist.com', 5, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Evernote', 'Note-taking app for capturing and organizing information', 'https://evernote.com', 5, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Obsidian', 'Knowledge management app for creating connected notes', 'https://obsidian.md', 5, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Airtable', 'Cloud collaboration service combining spreadsheet and database features', 'https://airtable.com', 5, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('ClickUp', 'All-in-one productivity platform for teams and individuals', 'https://clickup.com', 5, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Analytics Tools
('Google Analytics', 'Web analytics service for tracking website traffic and user behavior', 'https://analytics.google.com', 6, 'free', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Mixpanel', 'Product analytics platform for tracking user interactions', 'https://mixpanel.com', 6, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Amplitude', 'Digital analytics platform for understanding user behavior', 'https://amplitude.com', 6, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Hotjar', 'Behavior analytics tool with heatmaps and session recordings', 'https://hotjar.com', 6, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Tableau', 'Data visualization software for business intelligence', 'https://tableau.com', 6, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Power BI', 'Microsoft business analytics tool for data visualization', 'https://powerbi.microsoft.com', 6, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Looker', 'Business intelligence platform for data exploration', 'https://looker.com', 6, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Segment', 'Customer data platform for collecting and routing user data', 'https://segment.com', 6, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Communication Tools
('Zoom', 'Video conferencing platform for meetings and webinars', 'https://zoom.us', 7, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('Microsoft Teams', 'Collaboration platform combining chat, video meetings, and file storage', 'https://teams.microsoft.com', 7, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Discord', 'Voice, video, and text communication platform for communities', 'https://discord.com', 7, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Telegram', 'Cloud-based instant messaging and voice over IP service', 'https://telegram.org', 7, 'free', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('WhatsApp Business', 'Business communication platform for customer service', 'https://business.whatsapp.com', 7, 'free', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Loom', 'Video messaging tool for asynchronous communication', 'https://loom.com', 7, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Calendly', 'Scheduling tool for booking meetings and appointments', 'https://calendly.com', 7, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Intercom', 'Customer messaging platform for support and engagement', 'https://intercom.com', 7, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Finance Tools
('Stripe', 'Payment processing platform for online businesses', 'https://stripe.com', 8, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('PayPal', 'Digital payment platform for online transactions', 'https://paypal.com', 8, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('QuickBooks', 'Accounting software for small and medium businesses', 'https://quickbooks.intuit.com', 8, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Xero', 'Cloud-based accounting software for small businesses', 'https://xero.com', 8, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('FreshBooks', 'Cloud accounting software for freelancers and small businesses', 'https://freshbooks.com', 8, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Wave', 'Free accounting software for small businesses', 'https://waveapps.com', 8, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Mint', 'Personal finance management tool for budgeting and tracking', 'https://mint.com', 8, 'free', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('YNAB', 'Budgeting software for personal financial management', 'https://youneedabudget.com', 8, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- Education Tools
('Khan Academy', 'Free online learning platform with courses and exercises', 'https://khanacademy.org', 9, 'free', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Coursera', 'Online learning platform offering courses from universities', 'https://coursera.org', 9, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Udemy', 'Online learning marketplace with courses on various topics', 'https://udemy.com', 9, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Duolingo', 'Language learning platform with gamified lessons', 'https://duolingo.com', 9, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Skillshare', 'Online learning community for creative and business skills', 'https://skillshare.com', 9, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('MasterClass', 'Online learning platform with celebrity instructors', 'https://masterclass.com', 9, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Anki', 'Spaced repetition flashcard program for memorization', 'https://ankiweb.net', 9, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Grammarly', 'Writing assistant for grammar, spelling, and style checking', 'https://grammarly.com', 9, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),

-- E-commerce Tools
('Shopify', 'E-commerce platform for creating online stores', 'https://shopify.com', 10, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], true, true),
('WooCommerce', 'WordPress plugin for creating e-commerce websites', 'https://woocommerce.com', 10, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('BigCommerce', 'E-commerce platform for growing businesses', 'https://bigcommerce.com', 10, 'paid', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Magento', 'Open-source e-commerce platform for large businesses', 'https://magento.com', 10, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Square', 'Payment processing and point-of-sale system', 'https://squareup.com', 10, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Etsy', 'Marketplace for handmade and vintage items', 'https://etsy.com', 10, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Amazon Seller Central', 'Platform for selling products on Amazon marketplace', 'https://sellercentral.amazon.com', 10, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true),
('Gumroad', 'Platform for selling digital products and subscriptions', 'https://gumroad.com', 10, 'freemium', '/placeholder.svg?height=64&width=64', ARRAY['/placeholder.svg?height=400&width=600'], false, true);
