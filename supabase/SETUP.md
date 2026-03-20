# Supabase Setup

## Що вже підготовлено в проєкті

- інтеграція Supabase-авторизації для статичного Vercel-сайту
- сторінки:
  - `login.html`
  - `register.html`
  - `account.html`
- захист сторінки акаунта від неавторизованих користувачів
- збереження обраного й замовлень у власному кабінеті
- SQL-схема, RLS, trigger і policies в `supabase/setup.sql`

## Що потрібно зробити в Supabase Dashboard

1. Створіть новий Supabase-проєкт.
2. Відкрийте `SQL Editor`.
3. Скопіюйте й виконайте SQL із `supabase/setup.sql`.
4. Перейдіть у `Authentication` -> `Providers` -> `Email` і переконайтеся, що вхід по email/password увімкнений.
5. У `Authentication` -> `URL Configuration` вкажіть:
   - `Site URL`: ваш продакшн URL сайту на Vercel, наприклад `https://your-project.vercel.app`
   - `Redirect URLs`:
     - `https://your-project.vercel.app/account.html`
     - `https://your-project.vercel.app/login.html`
     - `https://your-project.vercel.app/register.html`
6. Якщо хочете, щоб користувачі підтверджували email перед входом, увімкніть email confirmation в Auth settings.
7. Якщо не хочете вимагати підтвердження пошти, вимкніть його в налаштуваннях Auth. Це залежить від вашого сценарію.
8. Перейдіть у `Project Settings` -> `API` і скопіюйте:
   - `Project URL`
   - `anon public key`

## Env-змінні

Додайте ці значення у Vercel Project Settings -> Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Шаблон уже підготовлений у `.env.example`.

## Як це працює в проєкті

- фронтенд не зберігає ключі Supabase прямо в HTML
- публічна конфігурація віддається через `api/public-config.js`
- доступ до кабінету відкривається на `account.html`
- якщо користувач не авторизований, `account.html` перенаправляє його на `login.html`
- профіль, замовлення та обране читаються через RLS-правила й доступні тільки власнику

## Як перевірити після налаштування

1. Зареєструйте нового користувача через `register.html`
2. Увійдіть через `login.html`
3. Відкрийте `account.html` і збережіть профіль
4. На головній сторінці додайте товар у обране
5. Оформіть замовлення через каталог після входу
6. Поверніться в `account.html` і перевірте вкладки `Замовлення` та `Обране`