-- projects table
create table projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  name          text not null,
  idea          text not null,
  current_stage text not null default 'REFINE',
  refine_progress int not null default 0,
  build_progress  int not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- module_outputs table
create table module_outputs (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  module_id  text not null,
  status     text not null default 'locked',
  output     jsonb,
  updated_at timestamptz default now(),
  unique (project_id, module_id)
);

-- Row Level Security
alter table projects enable row level security;
alter table module_outputs enable row level security;

create policy "users_own_projects" on projects
  for all using (auth.uid() = user_id);

create policy "users_own_outputs" on module_outputs
  for all using (
    project_id in (select id from projects where user_id = auth.uid())
  );
