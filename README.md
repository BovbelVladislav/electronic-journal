# Electronic Journal (Электронный журнал)

Веб-приложение для электронного журнала с ролями **Студент** и **Преподаватель**.

## Возможности

- Аутентификация (регистрация / вход, JWT)
- Расписание занятий
- Журнал оценок и посещаемости
- Лабораторные работы (создание, сдача файлов, проверка, комментарии)
- Разделение интерфейса по ролям

## Стек

| Frontend | Backend |
|----------|---------|
| React 19, TypeScript, Vite | Node.js, Express, TypeScript |
| Material UI, React Router | Prisma ORM, SQLite |
| Axios | JWT, bcrypt, Multer |

## Быстрый старт

```bash
# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev          # http://localhost:4000

# Frontend (новый терминал)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

## Тестовые аккаунты

| Email | Пароль | Роль |
|-------|--------|------|
| teacher@college.ru | password123 | Преподаватель |
| student1@college.ru | password123 | Студент |
| admin@college.ru | password123 | Администратор |

## API

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/auth/profile` — профиль
- `GET /api/subjects` — предметы
- `GET /api/lessons/schedule` — расписание
- `GET /api/grades/my` — мои оценки (студент)
- `POST /api/grades` — выставить оценку (преподаватель)
- `GET /api/labs` — лабораторные
- `POST /api/labs/:id/submit` — сдать работу
- `PATCH /api/labs/submissions/:id/grade` — оценить работу

## Авторы

- Kozhan Liza (lizakozhan@gmail.com)
- Grishechko Rita (rita.grishechko@gmail.com)
- Bovbel Vladislav (bovbelvladislav@gmail.com)
