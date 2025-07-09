/*
  # Креирање супер администратора

  1. Упутства за креирање супер администратора
    - Ручно креирање корисника у Supabase Auth панелу
    - Ажурирање профила са супер админ улогом
  
  2. Безбедност
    - Лозинка се не чува у коду
    - Користи се Supabase Auth за безбедно хеширање
*/

-- ВАЖНО: Пре покретања овог скрипта, потребно је:
-- 1. Ићи у Supabase Dashboard > Authentication > Users
-- 2. Кликнути "Add user" 
-- 3. Унети:
--    Email: djoricnenad@gmail.com
--    Password: 1Flasicradule!
--    Email Confirm: true (да се прескочи потврда е-поште)
-- 4. Копирати User ID који се генерише
-- 5. Заменити 'USER_ID_OVDE' испод са правим ID-јем

-- Након што креирате корисника у Auth панелу, покрените ово:
-- ЗАМЕНИТИ 'USER_ID_OVDE' СА ПРАВИМ UUID ИЗ AUTH ПАНЕЛА!

-- UPDATE profiles 
-- SET 
--   role = 'super_admin',
--   name = 'Ђорић Ненад',
--   bio = 'Супер администратор платформе, писац и уредник.',
--   is_active = true
-- WHERE id = 'USER_ID_OVDE';

-- Алтернативно, ако профил није аутоматски креиран:
-- INSERT INTO profiles (id, email, name, role, bio, is_active)
-- VALUES (
--   'USER_ID_OVDE',
--   'djoricnenad@gmail.com', 
--   'Ђорић Ненад',
--   'super_admin',
--   'Супер администратор платформе, писац и уредник.',
--   true
-- )
-- ON CONFLICT (id) DO UPDATE SET
--   role = 'super_admin',
--   name = 'Ђорић Ненад',
--   bio = 'Супер администратор платформе, писац и уредник.',
--   is_active = true;

-- Провера да ли је корисник успешно креиран:
-- SELECT id, email, name, role, is_active FROM profiles WHERE email = 'djoricnenad@gmail.com';