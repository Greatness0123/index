-- Insert initial tags
INSERT INTO tags (name, slug) VALUES
('Free', 'free'),
('Freemium', 'freemium'),
('Open Source', 'open-source'),
('API', 'api'),
('Chrome Extension', 'chrome-extension'),
('Mobile App', 'mobile-app'),
('Web App', 'web-app'),
('SaaS', 'saas'),
('No Code', 'no-code'),
('Automation', 'automation'),
('Collaboration', 'collaboration'),
('Real-time', 'real-time'),
('Cloud', 'cloud'),
('Self-hosted', 'self-hosted'),
('Enterprise', 'enterprise')
ON CONFLICT (slug) DO NOTHING;
