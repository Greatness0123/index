-- Check current tool count and data
SELECT COUNT(*) as total_tools FROM tools;
SELECT COUNT(*) as approved_tools FROM tools WHERE is_approved = true;
SELECT name, is_approved FROM tools ORDER BY created_at DESC LIMIT 10;
