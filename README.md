## Blog App

A full-stack blog application built with Express, Sequelize, and PostgreSQL on the backend, and React on the frontend. The app allows users to add, view, and manage blog posts. It also includes CI/CD support and uses Docker to manage the development environment.

### Prerequisites

* Docker and Docker Compose (for development environment setup)
* Node.js (v16 or higher recommended for local non-Docker development)
* PostgreSQL Database (configured via Docker Compose)

### Getting Started
1. Clone the Repository
```bash
	git clone https://github.com/patrick-selin/blog-app.git
	cd blog-app
```
2. Environment Variables
Set up environment variables for backend and database configurations.

    Create a .env file in the root directory and add the following:

```bash
    # Database configuration
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password
    POSTGRES_DB=your_db_name
  ```

3. Running the App in Development Mode with Docker
To spin up the backend server, database, and frontend in a Dockerized environment, use Docker Compose.

```bash
docker-compose up --build
```

 This command will:
* Build and start the backend server on http://localhost:3005
* Start the PostgreSQL database
* Volume mount your source code so changes are instantly reflected

4. Running the Frontend Locally
If you'd like to run the frontend locally outside of Docker:

	Open a new terminal window and navigate to the frontend directory:

 ```bash
	cd frontend
```
	Install dependencies and start the development server:

	```bash
		npm install
		npm run dev
	```
The frontend should now be running at http://localhost:5173.

#### Additional Scripts
Backend (from root directory)

* Development: Start the backend with hot-reloading
```bash
	npm run dev
```
* Database Migration Rollback:
```bash
	npm run migration:down
```
* Linting: Check code for style issues
```bash
	npm run lint
```
* Testing: Run Jest tests
```bash
	npm run test
```
* Deploy: Deploy to Fly.io (after building the frontend)
```bash
   npm run deploy:full
```

Frontend (from frontend directory)

* Build: Build the frontend for production
```bash
	npm run build
```
* Preview: Preview the production build locally
```bash
npm run preview
```
* E2E Testing: Open Cypress for end-to-end tests
```bash
npm run cypress:open
```

### Tech Stack:

Backend: Node.js, Express, Sequelize, PostgreSQL
Frontend: React, Vite, Axios
Dev Tools: Docker, ESLint, Cypress, Jest

###License:
This project is licensed under the MIT License.
