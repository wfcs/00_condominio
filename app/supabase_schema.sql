-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- 1. Tenants (Condo Clients)
create table public.condo_clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles (Users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  unit text,
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
  unique(poll_id, user_id)
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

create table public.announcement_likes (
  id uuid default uuid_generate_v4() primary key,
  announcement_id uuid references public.announcements(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(announcement_id, user_id)
);

create table public.announcement_comments (
  id uuid default uuid_generate_v4() primary key,
  announcement_id uuid references public.announcements(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  author_name text not null,
  author_unit text,
  content text not null,
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
  description text,
  file_url text not null,
  file_name text,
  file_size bigint,
  uploaded_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Charges (Financeiro)
create table public.charges (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.condo_clients(id) not null,
  unit_id text,
  description text not null,
  value integer not null,
  due_date date not null,
  status text check (status in ('PENDING', 'CONFIRMED', 'RECEIVED', 'OVERDUE', 'REFUNDED', 'CANCELED')) default 'PENDING',
  asaas_charge_id text,
  payment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Notifications (Portaria)
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.condo_clients(id) not null,
  unit_id text not null,
  type text check (type in ('entrega', 'visitante')) not null,
  description text not null,
  photo_url text,
  status text check (status in ('pendente', 'recebido')) default 'pendente',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

create or replace function public.get_my_client_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select client_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_sindico()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Síndico'
  );
$$;

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

alter table public.condo_clients enable row level security;
alter table public.profiles enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.announcements enable row level security;
alter table public.announcement_likes enable row level security;
alter table public.announcement_comments enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;
alter table public.charges enable row level security;
alter table public.notifications enable row level security;

-- ============================================
-- RLS POLICIES
-- ============================================

-- === CONDO_CLIENTS ===
create policy "Users see own client"
  on public.condo_clients for select
  using (id = get_my_client_id());

-- === PROFILES ===
create policy "Users can see own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Síndico can see tenant profiles"
  on public.profiles for select
  using (client_id = get_my_client_id() and is_sindico());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Síndico can insert profiles"
  on public.profiles for insert
  with check (client_id = get_my_client_id() and is_sindico());

create policy "Síndico can delete tenant profiles"
  on public.profiles for delete
  using (client_id = get_my_client_id() and is_sindico() and id != auth.uid());

-- === POLLS ===
create policy "Tenant users can view polls"
  on public.polls for select
  using (client_id = get_my_client_id());

create policy "Síndico can create polls"
  on public.polls for insert
  with check (client_id = get_my_client_id() and is_sindico());

create policy "Síndico can update polls"
  on public.polls for update
  using (client_id = get_my_client_id() and is_sindico());

create policy "Síndico can delete polls"
  on public.polls for delete
  using (client_id = get_my_client_id() and is_sindico());

-- === POLL_OPTIONS ===
create policy "View poll options"
  on public.poll_options for select
  using (
    exists (select 1 from public.polls where polls.id = poll_options.poll_id and polls.client_id = get_my_client_id())
  );

create policy "Síndico can insert poll options"
  on public.poll_options for insert
  with check (
    exists (select 1 from public.polls where polls.id = poll_options.poll_id and polls.client_id = get_my_client_id())
    and is_sindico()
  );

-- === POLL_VOTES ===
create policy "Users can view votes in their tenant"
  on public.poll_votes for select
  using (
    exists (select 1 from public.polls where polls.id = poll_votes.poll_id and polls.client_id = get_my_client_id())
  );

create policy "Users can cast vote"
  on public.poll_votes for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.polls
      where polls.id = poll_votes.poll_id
        and polls.client_id = get_my_client_id()
        and polls.active = true
    )
  );

-- === ANNOUNCEMENTS ===
create policy "Tenant users can view announcements"
  on public.announcements for select
  using (client_id = get_my_client_id());

create policy "Síndico can create announcements"
  on public.announcements for insert
  with check (client_id = get_my_client_id() and is_sindico());

create policy "Síndico can update announcements"
  on public.announcements for update
  using (client_id = get_my_client_id() and is_sindico());

create policy "Síndico can delete announcements"
  on public.announcements for delete
  using (client_id = get_my_client_id() and is_sindico());

-- === ANNOUNCEMENT_LIKES ===
create policy "View likes in tenant"
  on public.announcement_likes for select
  using (
    exists (select 1 from public.announcements where announcements.id = announcement_likes.announcement_id and announcements.client_id = get_my_client_id())
  );

create policy "Users can like"
  on public.announcement_likes for insert
  with check (user_id = auth.uid());

create policy "Users can unlike own"
  on public.announcement_likes for delete
  using (user_id = auth.uid());

-- === ANNOUNCEMENT_COMMENTS ===
create policy "View comments in tenant"
  on public.announcement_comments for select
  using (
    exists (select 1 from public.announcements where announcements.id = announcement_comments.announcement_id and announcements.client_id = get_my_client_id())
  );

create policy "Users can comment"
  on public.announcement_comments for insert
  with check (author_id = auth.uid());

create policy "Users can delete own comment"
  on public.announcement_comments for delete
  using (author_id = auth.uid());

-- === TASKS ===
create policy "Tenant users can view tasks"
  on public.tasks for select
  using (client_id = get_my_client_id());

create policy "Staff can create tasks"
  on public.tasks for insert
  with check (client_id = get_my_client_id());

create policy "Staff can update tasks"
  on public.tasks for update
  using (client_id = get_my_client_id());

create policy "Síndico can delete tasks"
  on public.tasks for delete
  using (client_id = get_my_client_id() and is_sindico());

-- === DOCUMENTS ===
create policy "Tenant users can view documents"
  on public.documents for select
  using (client_id = get_my_client_id());

create policy "Síndico can upload documents"
  on public.documents for insert
  with check (client_id = get_my_client_id() and is_sindico());

create policy "Síndico can delete documents"
  on public.documents for delete
  using (client_id = get_my_client_id() and is_sindico());

-- === CHARGES ===
create policy "Tenant users can view charges"
  on public.charges for select
  using (client_id = get_my_client_id());

create policy "Síndico can create charges"
  on public.charges for insert
  with check (client_id = get_my_client_id() and is_sindico());

create policy "Síndico can update charges"
  on public.charges for update
  using (client_id = get_my_client_id() and is_sindico());

-- === NOTIFICATIONS ===
create policy "Tenant users can view notifications"
  on public.notifications for select
  using (client_id = get_my_client_id());

create policy "Portaria can create notifications"
  on public.notifications for insert
  with check (client_id = get_my_client_id());

create policy "Users can update notification status"
  on public.notifications for update
  using (client_id = get_my_client_id());

-- ============================================
-- STORAGE BUCKET (for documents)
-- ============================================
-- Run in Supabase Dashboard > Storage:
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);
--
-- Storage RLS:
-- create policy "Tenant users can read documents" on storage.objects
--   for select using (
--     bucket_id = 'documents'
--     and (storage.foldername(name))[1] = (select client_id::text from public.profiles where id = auth.uid())
--   );
--
-- create policy "Síndico can upload documents" on storage.objects
--   for insert with check (
--     bucket_id = 'documents'
--     and (storage.foldername(name))[1] = (select client_id::text from public.profiles where id = auth.uid())
--     and is_sindico()
--   );
--
-- create policy "Síndico can delete documents" on storage.objects
--   for delete using (
--     bucket_id = 'documents'
--     and (storage.foldername(name))[1] = (select client_id::text from public.profiles where id = auth.uid())
--     and is_sindico()
--   );
