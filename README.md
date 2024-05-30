## Steps to install Movie System

- Clone the repo: `git clone https://github.com/adars124/movie-booking.git`

- Go to backend: `cd backend/`

- Initialize npm environment: `npm init --y` (Step 2)

- Install required libraries: `npm install` (Step 3)

- Add the following in the `.env` file:
     - `PORT=<your_port_addres>`
     - `JWT_SECRET=<your_secret_key>`

- Get a step back: `cd ..`

- Go to movie folder inside frontend: `cd frontend/movie/`

- Repeate step 2 and 3

- Add the following in the `.env` file:
     - `VITE_API_URL=<your_url_here>`

- Open two separate terminals.

- Go to backend: `cd backend` in one terminal. And `npm start` to start the backend server.

- Go to frontend: `cd frontend/movie/` in the other. And `npm run dev` to start the frontend server.


## For using CMS as admin

- Clone the CMS repo: `git clone https://github.com/adars124/Movie-cms.git`

- Go to CMS folder inside backend: `cd Movie-cms/`.

- Initialize npm environment: `npm init --y`

- Install required libraries: `npm install`

- Add the following in your `.env` file:
     - `VITE_API_URL=<your_url_here>`

- Start the server using: `npm run dev`

## For Database Configuration

1) Using visual (interactive) mode:
   - Download pgAdmin for querying to the database.
   - Copy the contents of `db.sql` file which is located inside: `cd backend/db/`
   - Hover to pgAdmin and paste the contents.
   - Execute the query.
2) Using terminal:
   - Go to: `cd backend/db`
   - Connect to pg server: `psql -h <your_host> -U <your_username> -d <your_database_name>`
   - Once connected, execute the SQL file: `\i db.sql`
   - Done!

**NOTE:** PostgresSQL should be installed in the system. Without postgres the project won't start!
