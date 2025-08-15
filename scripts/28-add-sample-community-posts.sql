-- Add sample community posts by random users
INSERT INTO community_posts (id, title, content, post_type, author_id, created_at, updated_at, likes_count, comments_count) VALUES
-- Discussion posts
('550e8400-e29b-41d4-a716-446655440001', 'What are your favorite AI tools for productivity?', 'I''ve been exploring different AI tools to boost my productivity. Currently using ChatGPT and Notion AI. What tools do you recommend for content creation and task automation?', 'discussion', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', 12, 8),

('550e8400-e29b-41d4-a716-446655440002', 'Best design tools for non-designers?', 'As a developer, I struggle with design. What are some user-friendly design tools that don''t require extensive design knowledge? Looking for something to create better UI mockups and presentations.', 'discussion', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 18, 15),

-- Showcase posts
('550e8400-e29b-41d4-a716-446655440003', 'Built a Chrome extension for better tab management', 'Just launched my first Chrome extension called TabMaster! It helps organize tabs into workspaces and saves sessions. Would love to get feedback from the community. It''s free and open source.', 'showcase', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', 25, 12),

('550e8400-e29b-41d4-a716-446655440004', 'My journey building a SaaS tool', 'After 6 months of development, I finally launched my project management tool for small teams. Here''s what I learned about user research, MVP development, and finding product-market fit.', 'showcase', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours', 31, 9),

-- Question posts
('550e8400-e29b-41d4-a716-446655440005', 'How to validate a SaaS idea before building?', 'I have an idea for a tool that helps freelancers manage client communications. Before I start building, what are the best ways to validate if there''s actual demand for this?', 'question', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', 8, 14),

-- Advertisement posts
('550e8400-e29b-41d4-a716-446655440006', '🚀 New AI Writing Assistant - 50% off launch week', 'Introducing WriteFlow - an AI-powered writing assistant that helps you create better content faster. Features include tone adjustment, grammar checking, and content optimization. Use code LAUNCH50 for 50% off!', 'advertisement', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '8 hours', NOW() - INTERVAL '8 hours', 6, 3),

-- Announcement posts
('550e8400-e29b-41d4-a716-446655440007', 'Community Guidelines Update', 'We''ve updated our community guidelines to better support creators and maintain quality discussions. Key changes include clearer rules about self-promotion and improved moderation policies.', 'announcement', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', 15, 7);

-- Add some sample comments
INSERT INTO community_comments (id, post_id, content, author_id, created_at, updated_at, likes_count) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'I highly recommend trying out Jasper AI for content creation. It''s been a game-changer for my blog writing workflow.', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 5),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'For task automation, I''ve been using Zapier combined with Airtable. The integration possibilities are endless!', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours', 3),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Canva is perfect for non-designers! They have templates for everything and the drag-and-drop interface is super intuitive.', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '18 hours', NOW() - INTERVAL '18 hours', 8),

('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'This looks amazing! Just installed it and the workspace feature is exactly what I needed. Great work!', (SELECT id FROM auth.users LIMIT 1 OFFSET 0), NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', 4);
