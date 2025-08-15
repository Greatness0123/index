-- Insert sample community posts
INSERT INTO community_posts (title, content, post_type, author_name, show_author, tags) VALUES
('Welcome to the Index Community!', 'This is our new community space where you can share tools, ask questions, and connect with other users. Feel free to introduce yourself and share your favorite productivity tools!', 'announcement', 'Index Team', true, ARRAY['welcome', 'announcement']),

('Show off your workspace setup', 'Share photos of your workspace and the tools you use daily. What makes your setup unique? What tools have transformed your productivity?', 'showcase', 'ProductivityGuru', true, ARRAY['workspace', 'productivity', 'showcase']),

('Looking for the best AI writing tools', 'I''m a content creator looking for AI tools to help with writing blog posts and social media content. What are your recommendations? I''ve tried ChatGPT but looking for alternatives.', 'question', 'ContentCreator23', true, ARRAY['ai', 'writing', 'content']),

('Introducing TaskFlow - A new project management tool', 'Hey everyone! I''ve been working on TaskFlow, a simple yet powerful project management tool designed for small teams. It features kanban boards, time tracking, and team collaboration. Check it out and let me know what you think!', 'advertisement', 'TaskFlowDev', true, ARRAY['project-management', 'productivity', 'startup']),

('Best design tools for beginners?', 'I''m just starting out in design and feeling overwhelmed by all the options. Figma, Sketch, Adobe XD... what would you recommend for someone just beginning their design journey?', 'question', 'DesignNewbie', true, ARRAY['design', 'beginner', 'tools']),

('My experience switching from Notion to Obsidian', 'After using Notion for 2 years, I made the switch to Obsidian for my note-taking and knowledge management. Here''s what I learned and why I made the change...', 'discussion', 'KnowledgeSeeker', true, ARRAY['notion', 'obsidian', 'note-taking']);

-- Insert sample comments
INSERT INTO community_comments (post_id, content, author_name, show_author) 
SELECT 
  p.id,
  CASE 
    WHEN p.title LIKE '%Welcome%' THEN 'Thanks for creating this space! Looking forward to discovering new tools here.'
    WHEN p.title LIKE '%workspace%' THEN 'Love this idea! I''ll share my setup soon. Currently using a standing desk with dual monitors and loving it.'
    WHEN p.title LIKE '%AI writing%' THEN 'I highly recommend Jasper AI and Copy.ai. Both have been game-changers for my content workflow.'
    WHEN p.title LIKE '%TaskFlow%' THEN 'This looks interesting! Is there a free tier available? Would love to try it with my team.'
    WHEN p.title LIKE '%design tools%' THEN 'Figma is definitely the way to go for beginners. It''s free, web-based, and has tons of tutorials available.'
    ELSE 'Great post! Thanks for sharing your insights.'
  END,
  CASE (RANDOM() * 4)::INT
    WHEN 0 THEN 'TechEnthusiast'
    WHEN 1 THEN 'StartupFounder'
    WHEN 2 THEN 'DesignPro'
    ELSE 'ProductivityHacker'
  END,
  true
FROM community_posts p
WHERE p.title NOT LIKE '%Obsidian%';

-- Add some likes to posts and comments
INSERT INTO community_post_likes (post_id, user_id)
SELECT 
  p.id,
  gen_random_uuid()
FROM community_posts p
CROSS JOIN generate_series(1, (RANDOM() * 5 + 1)::INT);

INSERT INTO community_comment_likes (comment_id, user_id)
SELECT 
  c.id,
  gen_random_uuid()
FROM community_comments c
CROSS JOIN generate_series(1, (RANDOM() * 3 + 1)::INT);
