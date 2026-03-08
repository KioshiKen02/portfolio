-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON "public"."projects"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."skills"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."settings"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Create policy for public insert access (Contact Form)
CREATE POLICY "Enable insert access for all users" ON "public"."contacts"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for admin read access (optional, assuming admin uses authenticated role or service_role)
-- If you access via Laravel (postgres user), these policies are bypassed by default.
-- If you access via Supabase Client (anon key), these policies are required.
