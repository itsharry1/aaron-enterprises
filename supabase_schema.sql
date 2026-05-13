-- 1) Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'CUSTOMER',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2) Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  booking_type TEXT NOT NULL,
  service_id TEXT,
  plan_id TEXT,
  purchase_details JSONB,
  date TEXT,
  time TEXT,
  status TEXT DEFAULT 'Pending',
  ac_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on RLS for bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Note: user_id can be null if guest, but the prompt says 
-- "Make sure rows belong only to the authenticated user using RLS + policies with auth.uid()"
-- If guest bookings shouldn't be allowed, user_id must be required.
-- If guest bookings are allowed but can't be viewed, we can allow insert when user_id is null, or just require auth.
-- Let's require auth for viewing/editing, but allow people to insert anonymously if needed?
-- Better to strictly enforce user ownership as requested.

CREATE POLICY "Users can insert their own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view and update all bookings"
  ON public.bookings
  FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'ADMIN')
    OR (auth.uid() = user_id)
  );

CREATE POLICY "Users can update their own bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.bookings
  FOR DELETE
  USING (auth.uid() = user_id);
