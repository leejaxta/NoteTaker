
---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Database Design](#database-design)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Engineering Decisions](#engineering-decisions)
- [Assumptions](#assumptions)

---

## Features

### Core Features
- User authentication (signup & login)
- Create, read, update, delete notes
- Email verification for signup
- Assign multiple categories to notes
- Search notes by title or content
- Filter notes by category
- Server-side pagination
- Protected routes & JWT authentication


### Backend
- RESTful APIs
- Swagger documentation
- Logging via Winston
- Validation and error handling
- Unit tests (Jest)

### Frontend
- Responsive UI built with React
- Reusable components (Button, Input, Modal, CategorySelect, Pagination)
- Notes create/edit via deticated NoteDetails page
- Implemented use of text alignments, styles and lists using tiptap
- Toast notifications for actions
- Search and filter functionality
- Pagination UI
- Unit tests (Jest)

---

## Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | React, Axios, React Router |
| Backend      | Node.js, Express, MySQL |
| Database     | MySQL |
| Documentation| Swagger |
| Logging      | Winston |

---

## Setup Instructions

### Backend

1. Clone the repository:
```bash
git clone <repo-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup `.env` file (using .env.example):

4. Initialize database:

Create a MySQL database named `notes_app`

```sql
CREATE DATABASE IF NOT EXISTS notes_app;
```

Run Knex migrations to create tables and relationships:
```bash
npx knex migrate:latest

```

5. Start backend:
```bash
npm run dev
```

6. Swagger UI available at:
```
http://localhost:5000/api-docs
```

---

### Frontend

1. Go to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm run dev
```

4. Open in browser:
```
http://localhost:5173
```

---

## Database Design

### Tables

1. **users**
- id (PK)
- name
- email
- password_hash
- created_at
- updated_at

2. **notes**
- id (PK)
- user_id (FK)
- title
- content
- created_at
- updated_at

3. **categories**
- id (PK)
- name
- created_at
- updated_at

4. **note_categories** (many-to-many)
- note_id (PK, FK)
- category_id (PK, FK)
> Database is normalized to reduce redundancy and maintain relationships efficiently.

---

## Frontend Architecture

- **Context**: `AuthContext` for authentication state; JWT is stored securely in HTTP-only cookies instead of localStorage for improved security.
- **API Layer**: `api/` folder with Axios instance and endpoints
- **Reusable Components**: Button, Input, Modal, CategorySelect, Pagination
- **Pages**: Login, Signup, Notes, NoteDetails
- **Routing**: React Router with ProtectedRoute component
- **UI State Management**: useState + useEffect

---

## Backend Architecture

- **Express Routes**: Organized by feature (auth, notes, categories)
- **Services**: Business logic separated from routes (`note.service.js`, `auth.service.js`)
- **Controllers**: Handle requests and responses
- **Database**: MySQL with normalized tables and many-to-many relationships
- **Middleware**: Auth, request logging, error handling
- **Logging**: Winston for structured logs
- **Swagger**: Auto-generated API documentation

---

## Engineering Decisions

- **React Context** for auth → simple, no external state library needed  
- **Axios interceptors** → JWT is automatically sent via cookies, reducing risk of XSS attacks compared to localStorage. 
- **Reusable components** → maintainable and scalable UI  
- **Server-side pagination & filtering** → scalable for large datasets  
- **Winston logging** → structured and professional backend logs  
- **Dedicated page for edit/create** → clean UX with enough space to create note

---

## Assumptions

- User emails are unique
- Each note can have multiple categories
- Pagination default limit: 8
- Backend validation ensures data integrity
- Frontend validation ensures good UX

---

## Author

**Leeja Sagar Shrestha**

---