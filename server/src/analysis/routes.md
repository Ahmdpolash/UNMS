# PH University Management Project

## API Endpoints

#### User:

- users/create-student (POST)
- users/create-faculty (POST)
- users/create-admin (POST)

#### Student:

- students (GET)
- students/:id (GET)
- students/:id (PATCH)
- students/:id (DELETE)
- students/my-profile

#### Faculty:

- faculties(GET)
- faculties/:id (GET)
- faculties/:id (PATCH)
- faculties/:id (DELETE)
- faculties/my-profile

#### Admin:

- admins (GET)
- admins /:id (GET)
- admins /:id (PATCH)
- admins /:id (DELETE)
- admins /my-profile

### Auth:

- auth/login
- auth/refresh-token
- auth/change-password
- auth/forgot-password
- auth/reset-password

### academic semesters

- create-academic-semester (POST)
- academic-semesters (GET)
- Academic-semesters/:id (GET)
- Academic-semesters/:id (DELETE)
- Academic-semesters/:id (PATCH)
