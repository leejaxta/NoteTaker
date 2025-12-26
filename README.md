## Database Setup

1. Create a MySQL database named `notes_app`
2. Run the initialization script:
   mysql -u root -p < scripts/init-db.sql
3. Configure environment variables in `.env`
4. Start the server

## Logging

The backend uses Winston for structured logging.  
All incoming requests and errors are logged centrally to aid debugging and monitoring.
