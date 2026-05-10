-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  cost_price NUMERIC NOT NULL DEFAULT 0,
  selling_price NUMERIC NOT NULL DEFAULT 0
);

-- Table: expenses
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0
);

-- Table: daily_deliveries
CREATE TABLE IF NOT EXISTS public.daily_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  ordered INTEGER NOT NULL DEFAULT 0,
  delivered INTEGER NOT NULL DEFAULT 0,
  returned INTEGER NOT NULL DEFAULT 0
);

-- Turn on Row Level Security (RLS) but allow anonymous access for this simple personal tracker
-- Note: In a real production app, you would require authentication. Since this is a personal
-- Vercel deployment without an auth system yet, we allow all operations.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update expenses" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete expenses" ON public.expenses FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read daily_deliveries" ON public.daily_deliveries FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert daily_deliveries" ON public.daily_deliveries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update daily_deliveries" ON public.daily_deliveries FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete daily_deliveries" ON public.daily_deliveries FOR DELETE USING (true);
