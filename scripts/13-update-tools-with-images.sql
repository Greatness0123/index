-- Update existing tools with logos and screenshots
UPDATE tools SET 
  logo_url = '/placeholder.svg?height=64&width=64',
  screenshot_urls = ARRAY['/placeholder.svg?height=400&width=600']
WHERE name = 'ChatGPT';

UPDATE tools SET 
  logo_url = '/placeholder.svg?height=64&width=64',
  screenshot_urls = ARRAY['/placeholder.svg?height=400&width=600']
WHERE name = 'Figma';

UPDATE tools SET 
  logo_url = '/placeholder.svg?height=64&width=64',
  screenshot_urls = ARRAY['/placeholder.svg?height=400&width=600']
WHERE name = 'Notion';

UPDATE tools SET 
  logo_url = '/placeholder.svg?height=64&width=64',
  screenshot_urls = ARRAY['/placeholder.svg?height=400&width=600']
WHERE name = 'Slack';
