begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null unique,
    full_name text,
    phone text,
    city text,
    avatar_url text,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    status text not null default 'new' check (status in ('new', 'processing', 'completed', 'cancelled')),
    contact_name text not null,
    contact_phone text not null,
    comment text,
    total_amount numeric(10, 2) not null default 0,
    currency text not null default 'UAH',
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders (id) on delete cascade,
    product_slug text not null,
    product_title text not null,
    product_category text,
    product_image_url text,
    unit_price numeric(10, 2) not null default 0,
    quantity integer not null default 1 check (quantity > 0),
    line_total numeric(10, 2) generated always as (unit_price * quantity) stored,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.favorites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    product_slug text not null,
    product_title text not null,
    product_category text,
    product_price numeric(10, 2),
    product_image_url text,
    product_url text,
    created_at timestamptz not null default timezone('utc', now()),
    constraint favorites_user_product_unique unique (user_id, product_slug)
);

create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_favorites_user_id on public.favorites (user_id);

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_row_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_row_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
    insert into public.profiles (id, email, full_name)
    values (
        new.id,
        new.email,
        nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '')
    )
    on conflict (id) do update
    set
        email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);

    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.order_items to authenticated;
grant select, insert, update, delete on public.favorites to authenticated;

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists orders_select_own on public.orders;
create policy orders_select_own
on public.orders
for select
using (auth.uid() = user_id);

drop policy if exists orders_insert_own on public.orders;
create policy orders_insert_own
on public.orders
for insert
with check (auth.uid() = user_id);

drop policy if exists orders_update_own on public.orders;
create policy orders_update_own
on public.orders
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists orders_delete_own on public.orders;
create policy orders_delete_own
on public.orders
for delete
using (auth.uid() = user_id);

drop policy if exists favorites_select_own on public.favorites;
create policy favorites_select_own
on public.favorites
for select
using (auth.uid() = user_id);

drop policy if exists favorites_insert_own on public.favorites;
create policy favorites_insert_own
on public.favorites
for insert
with check (auth.uid() = user_id);

drop policy if exists favorites_update_own on public.favorites;
create policy favorites_update_own
on public.favorites
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists favorites_delete_own on public.favorites;
create policy favorites_delete_own
on public.favorites
for delete
using (auth.uid() = user_id);

drop policy if exists order_items_select_own on public.order_items;
create policy order_items_select_own
on public.order_items
for select
using (
    exists (
        select 1
        from public.orders
        where orders.id = order_items.order_id
          and orders.user_id = auth.uid()
    )
);

drop policy if exists order_items_insert_own on public.order_items;
create policy order_items_insert_own
on public.order_items
for insert
with check (
    exists (
        select 1
        from public.orders
        where orders.id = order_items.order_id
          and orders.user_id = auth.uid()
    )
);

drop policy if exists order_items_update_own on public.order_items;
create policy order_items_update_own
on public.order_items
for update
using (
    exists (
        select 1
        from public.orders
        where orders.id = order_items.order_id
          and orders.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.orders
        where orders.id = order_items.order_id
          and orders.user_id = auth.uid()
    )
);

drop policy if exists order_items_delete_own on public.order_items;
create policy order_items_delete_own
on public.order_items
for delete
using (
    exists (
        select 1
        from public.orders
        where orders.id = order_items.order_id
          and orders.user_id = auth.uid()
    )
);

commit;
