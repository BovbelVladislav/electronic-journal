# API Documentation

Base URL: `http://localhost:4000/api`

## Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Регистрация |
| POST | /auth/login | Вход |
| GET | /auth/profile | Профиль (Bearer token) |

## Subjects & Schedule
| Method | Path | Description |
|--------|------|-------------|
| GET | /subjects | Список предметов |
| POST | /subjects | Создать предмет (teacher) |
| GET | /lessons/schedule | Расписание (?from, ?to) |
| POST | /lessons | Добавить занятие (teacher) |

## Journal
| Method | Path | Description |
|--------|------|-------------|
| GET | /grades/my | Мои оценки (student) |
| GET | /grades/subject/:id | Оценки по предмету |
| POST | /grades | Выставить оценку (teacher) |
| GET | /attendance/my | Моя посещаемость |

## Labs
| Method | Path | Description |
|--------|------|-------------|
| GET | /labs | Все лабораторные |
| POST | /labs | Создать (teacher) |
| POST | /labs/:id/submit | Сдать работу (multipart) |
| PATCH | /labs/submissions/:id/grade | Оценить работу |
