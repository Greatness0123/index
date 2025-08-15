-- Remove duplicate tools based on URL
WITH duplicates AS (
  SELECT id, url, ROW_NUMBER() OVER (PARTITION BY url ORDER BY created_at ASC) as rn
  FROM tools
)
DELETE FROM tools 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Remove duplicate categories based on slug
WITH duplicate_categories AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at ASC) as rn
  FROM categories
)
DELETE FROM categories 
WHERE id IN (
  SELECT id FROM duplicate_categories WHERE rn > 1
);

-- Remove duplicate tags based on slug
WITH duplicate_tags AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at ASC) as rn
  FROM tags
)
DELETE FROM tags 
WHERE id IN (
  SELECT id FROM duplicate_tags WHERE rn > 1
);
