-- South Speed Food — schéma complet (projet Supabase DÉDIÉ, ne pas appliquer ailleurs).
-- Commandes livrées devant les boîtes de nuit ; paiement à la livraison.
-- Modèle : le site public crée des commandes uniquement via la RPC create_speed_order
-- (security definer, total recalculé serveur) ; tout utilisateur authentifié = équipe.

create table public.speed_orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity unique,
  club_id text not null check (club_id in ('mess', 'le-duplex', 'carre-coast-biarritz', 'l-opium')),
  club_name text not null check (char_length(club_name) between 1 and 60),
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text not null check (customer_phone ~ '^[0-9+ .()-]{6,20}$'),
  comments text check (char_length(comments) <= 500),
  items jsonb not null check (
    jsonb_typeof(items) = 'array'
    and jsonb_array_length(items) between 1 and 30
  ),
  total numeric(8, 2) not null check (total >= 0 and total <= 500),
  status text not null default 'new'
    check (status in ('new', 'preparing', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_speed_orders_status on public.speed_orders (status);
create index idx_speed_orders_created_at on public.speed_orders (created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger speed_orders_updated_at
  before update on public.speed_orders
  for each row execute function public.set_updated_at();

alter table public.speed_orders enable row level security;

-- Le public n'a AUCUN accès direct à la table : la création passe par la RPC.
-- L'équipe (tout compte authentifié de ce projet dédié) lit et met à jour.
create policy "Staff can view speed orders" on public.speed_orders
  for select to authenticated using (true);

create policy "Staff can update speed orders" on public.speed_orders
  for update to authenticated using (true) with check (true);

create or replace function public.create_speed_order(
  p_club_id text,
  p_club_name text,
  p_customer_name text,
  p_customer_phone text,
  p_comments text,
  p_items jsonb
) returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total numeric(8, 2) := 0;
  v_number bigint;
  v_item jsonb;
begin
  if jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) not between 1 and 30 then
    raise exception 'invalid items';
  end if;

  -- Total recalculé serveur, avec bornes de sécurité par article.
  for v_item in select * from jsonb_array_elements(p_items) loop
    if (v_item ->> 'price')::numeric not between 0 and 100
       or (v_item ->> 'quantity')::int not between 1 and 20 then
      raise exception 'invalid item';
    end if;
    v_total := v_total
      + (v_item ->> 'price')::numeric * (v_item ->> 'quantity')::int;
  end loop;

  insert into speed_orders
    (club_id, club_name, customer_name, customer_phone, comments, items, total)
  values
    (p_club_id, p_club_name, trim(p_customer_name), trim(p_customer_phone),
     nullif(trim(coalesce(p_comments, '')), ''), p_items, v_total)
  returning order_number into v_number;

  return v_number;
end $$;

revoke all on function public.create_speed_order(text, text, text, text, text, jsonb) from public;
grant execute on function public.create_speed_order(text, text, text, text, text, jsonb)
  to anon, authenticated;

-- Temps réel pour l'écran camionnette (/admin).
alter publication supabase_realtime add table public.speed_orders;
