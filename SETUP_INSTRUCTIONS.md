# Упутство за подешавање супер администратора

## Корак 1: Креирање корисника у Supabase Auth

1. Идите у ваш Supabase Dashboard
2. Кликните на **Authentication** у левом менију
3. Кликните на **Users** таб
4. Кликните на **Add user** дугме
5. Попуните форму:
   - **Email**: `djoricnenad@gmail.com`
   - **Password**: `1Flasicradule!`
   - **Email Confirm**: Означите да се прескочи потврда е-поште
6. Кликните **Create user**
7. **ВАЖНО**: Копирајте User ID који се генерише (изгледа као UUID)

## Корак 2: Ажурирање профила

1. Идите у **SQL Editor** у Supabase Dashboard
2. Покрените следећи SQL (заменити `USER_ID_OVDE` са правим ID-јем):

```sql
UPDATE profiles 
SET 
  role = 'super_admin',
  name = 'Ђорић Ненад',
  bio = 'Супер администратор платформе, писац и уредник.',
  is_active = true
WHERE id = 'USER_ID_OVDE';
```

Ако профил није аутоматски креиран, користите:

```sql
INSERT INTO profiles (id, email, name, role, bio, is_active)
VALUES (
  'USER_ID_OVDE',
  'djoricnenad@gmail.com', 
  'Ђорић Ненад',
  'super_admin',
  'Супер администратор платформе, писац и уредник.',
  true
)
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  name = 'Ђорић Ненад',
  bio = 'Супер администратор платформе, писац и уредник.',
  is_active = true;
```

## Корак 3: Провера

Проверите да ли је корисник успешно креиран:

```sql
SELECT id, email, name, role, is_active 
FROM profiles 
WHERE email = 'djoricnenad@gmail.com';
```

## Безбедносне напомене

- ✅ Лозинка се не чува нигде у коду
- ✅ Supabase безбедно хеширује лозинку
- ✅ Лозинка није видљива на сајту
- ✅ Користи се Supabase Auth за аутентификацију

## Тестирање

Након подешавања, можете се пријавити на сајт са:
- **Email**: djoricnenad@gmail.com
- **Password**: 1Flasicradule!

Корисник ће имати пуне супер админ привилегије.