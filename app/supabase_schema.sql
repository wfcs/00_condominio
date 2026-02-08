-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tenants (Condo Clients)
create table public.condo_clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles (Users)
-- Linked to auth.users via id
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  unit text, -- e.g. "101A"
  role text check (role in ('Morador', 'Síndico', 'Portaria', 'Manutenção')) default 'Morador',
  client_id uuid references public.condo_clients(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Polls (Votações)
create table public.polls (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.condo_clients(id) not null,
  title text not null,
  description text,
  end_date timestamp with time zone,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.poll_options (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  text text not null,
  votes integer default 0
);

create table public.poll_votes (
  id uuid default uuid_generate_v4() primary key,
  poll_id uuid references public.polls(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  option_id uuid references public.poll_options(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(poll_id, user_id) -- One vote per user per poll
);

-- 4. Announcements (Mural)
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.condo_clients(id) not null,
  title text not null,
  content text not null,
  category text check (category in ('Assembleia', 'Comunicado', 'Evento', 'Brechó', 'Social')),
  author_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Operational Tasks (Chamados)
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.condo_clients(id) not null,
  type text check (type in ('Compra', 'Manutenção')),
  priority text check (priority in ('Baixa', 'Média', 'Alta', 'Crítica')),
  description text not null,
  status text check (status in ('Aberto', 'Em Andamento', 'Resolvido')) default 'Aberto',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  assigned_to uuid references public.profiles(id)
);

-- 6. Documents
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.condo_clients(id) not null,
  title text not null,
  category text,
  file_url text not null,
  file_name text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Charges (Financeiro)
create table public.charges (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.condo_clients(id) not null,
  unit_id text, -- Unidade (ex: "101A") - could be linked to a unit table if normalized further
  description text not null,
  value integer not null, -- em centavos
  due_date date not null,
  status text check (status in ('PENDING', 'CONFIRMED', 'RECEIVED', 'OVERDUE', 'REFUNDED', 'CANCELED')) default 'PENDING',
  asaas_charge_id text,
  payment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Basic Examples)
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.polls enable row level security;
alter table public.announcements enable row level security;
alter table public.tasks enable row level security;
alter table public.charges enable row level security;

-- Policies
-- Users can see their own profile
create policy "Users can see own profile" on public.profiles
  for select using (auth.uid() = id);

-- Users can see data from their own client (Tenant Isolation)
-- Requires a helper function to get current user's client_id usually, 
-- or a join. For simplicity in this schema, we assume a verified approach later.
-- valid_client_check: auth.uid() -> profile.client_id = table.client_id
