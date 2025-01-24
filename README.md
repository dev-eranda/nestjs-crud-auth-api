# NestJS CRUD API

**Developed By:** Eranda Samarasinghe
<hr />

## Project Backgroud and Overview
Focused on mastering back-end development, I built a secure authentication application using NestJS. This project helped me understand best practices in API security, modular architecture, and effective database management while integrating advanced testing techniques.
<hr />

## Project Goals
The main objectives of this application are to:

1. Implemented JWT-based authentication for securing API endpoints and managing user sessions.
2. Developed a modular codebase using dependency injection and decorators in NestJS.
3  Utilized PostgreSQL within a Docker environment to ensure efficient database management and deployment.
4. Enabled CRUD operations to facilitate resource management within the application.
5. Integrated end-to-end (e2e) testing using Pact to ensure the integrity and reliability of the application.
<hr />

## Technical Details
Core technologies used: 

- **NestJS, PostgreeSQL, JWT Authentication**
<hr />

## Installation
1. Clone repository:
   ```sh
   git clone https://github.com/dev-eranda/nestjs-crud-auth-api
   
2. Start development server:
   ```sh
   yarn run start

3. Start watch mode:
   ```sh
   yarn run start:dev 
   
  - **Open [http://localhost:5432](http://localhost:5432) with your browser to see the result.**
    
## Test
1. Clone repository:
   ```sh
   yarn run test
   
2. Start development server:
   ```sh
   yarn run test:e2e
