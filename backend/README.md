### Backend

1. Clone the repository (if you haven’t already):
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
