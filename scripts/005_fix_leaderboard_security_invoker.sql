-- Fix Supabase advisor warning:
-- "Data is publicly accessible via API as this is a Security definer view."
--
-- security_invoker makes the view respect the permissions/RLS policies of the
-- user querying it instead of running with owner privileges.

ALTER VIEW public.leaderboard SET (security_invoker = true);
