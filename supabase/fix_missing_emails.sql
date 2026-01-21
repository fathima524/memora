-- 1. Create a function that runs when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name', -- Grabs name if sent during signup
    'student' -- Default role
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger (this listens for new signups)
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. (Optional) Fix existing missing emails
-- This updates rows in 'profiles' that have NULL emails by matching IDs with 'auth.users'
update public.profiles as p
set email = u.email
from auth.users as u
where p.id = u.id
and p.email is null;
