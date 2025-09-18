-- Populate missing tool images with placeholder images based on tool names
-- This script will add placeholder images for tools that don't have image_url set

-- Update tools with missing images to use placeholder images
UPDATE public.tools 
SET image_url = CASE 
    WHEN LOWER(name) LIKE '%docker%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'
    WHEN LOWER(name) LIKE '%github%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
    WHEN LOWER(name) LIKE '%slack%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg'
    WHEN LOWER(name) LIKE '%notion%' THEN 'https://www.notion.so/images/favicon.ico'
    WHEN LOWER(name) LIKE '%figma%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg'
    WHEN LOWER(name) LIKE '%vscode%' OR LOWER(name) LIKE '%visual studio%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg'
    WHEN LOWER(name) LIKE '%chrome%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg'
    WHEN LOWER(name) LIKE '%firefox%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg'
    WHEN LOWER(name) LIKE '%react%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
    WHEN LOWER(name) LIKE '%vue%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'
    WHEN LOWER(name) LIKE '%angular%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg'
    WHEN LOWER(name) LIKE '%node%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
    WHEN LOWER(name) LIKE '%python%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
    WHEN LOWER(name) LIKE '%javascript%' OR LOWER(name) LIKE '%js%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    WHEN LOWER(name) LIKE '%typescript%' OR LOWER(name) LIKE '%ts%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
    WHEN LOWER(name) LIKE '%mongodb%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'
    WHEN LOWER(name) LIKE '%mysql%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'
    WHEN LOWER(name) LIKE '%postgresql%' OR LOWER(name) LIKE '%postgres%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'
    WHEN LOWER(name) LIKE '%redis%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg'
    WHEN LOWER(name) LIKE '%aws%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg'
    WHEN LOWER(name) LIKE '%google%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
    WHEN LOWER(name) LIKE '%microsoft%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg'
    WHEN LOWER(name) LIKE '%apple%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg'
    WHEN LOWER(name) LIKE '%android%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg'
    WHEN LOWER(name) LIKE '%ios%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg'
    WHEN LOWER(name) LIKE '%chatgpt%' OR LOWER(name) LIKE '%openai%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%ahrefs%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%hubspot%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%mailchimp%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%stripe%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%paypal%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%zoom%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%teams%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%discord%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%telegram%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%whatsapp%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%twitter%' OR LOWER(name) LIKE '%x.com%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%linkedin%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%facebook%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%instagram%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%youtube%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%tiktok%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%shopify%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%woocommerce%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%wordpress%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg'
    WHEN LOWER(name) LIKE '%drupal%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%joomla%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%analytics%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%dashboard%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%api%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%database%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%cloud%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%security%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%backup%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%monitor%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%test%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%deploy%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%ci/cd%' OR LOWER(name) LIKE '%pipeline%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%git%' THEN 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'
    WHEN LOWER(name) LIKE '%editor%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%ide%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%design%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%photo%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%video%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%audio%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%music%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%game%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%productivity%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%calendar%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%email%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%chat%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%communication%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%crm%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%erp%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%hr%' OR LOWER(name) LIKE '%human%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%finance%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%accounting%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%invoice%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%project%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%task%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%time%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%report%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%document%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%pdf%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%excel%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%word%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%powerpoint%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%presentation%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%survey%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%form%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%quiz%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%learning%' OR LOWER(name) LIKE '%education%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%course%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%training%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%certification%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%health%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%fitness%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%travel%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%hotel%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%food%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%recipe%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%weather%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%news%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%blog%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%wiki%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%search%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%translate%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%dictionary%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%map%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%gps%' THEN '/placeholder.svg?height=32&width=32'
    WHEN LOWER(name) LIKE '%location%' THEN '/placeholder.svg?height=32&width=32'
    ELSE '/placeholder.svg?height=32&width=32'
END
WHERE image_url IS NULL OR image_url = '';

-- Ensure all tools have is_approved set to true for visibility
UPDATE public.tools SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;

-- Update tool stats for all tools to ensure they have proper statistics
INSERT INTO public.tool_stats (tool_id, comment_count, favorite_count, view_count, click_count, updated_at)
SELECT 
    t.id,
    0,
    0,
    0,
    0,
    NOW()
FROM public.tools t
WHERE NOT EXISTS (
    SELECT 1 FROM public.tool_stats ts WHERE ts.tool_id = t.id
)
ON CONFLICT (tool_id) DO NOTHING;

COMMIT;
