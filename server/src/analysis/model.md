# Data Model

### User:

- \_id
- id (generated)
- password
- needsPasswordChange
- role
- status
- isDeleted
- createdAt
- updatedAt

### Student:

- \_id
- id (generated)
- name
- gender
- dateOfBirth
- email
- contactNo
- emergencyContactNo
- presentAddress
- permanentAddress
- guardian
- localGuardian
- profileImage
- admissionSemester
- isDeleted
- createdAt
- updatedAt

### Faculty:

- \_id
- id (generated)
- designation
- name
- gender
- dateOfBirth
- email
- contactNo
- emergencyContactNo
- presentAddress
- permanentAddress
- profileImage
- academicFaculty
- academicDepartment
- isDeleted
- createdAt
- updatedAt

### Admin:

- \_id
- id (generated)
- designation
- name
- gender
- dateOfBirth
- email
- contactNo
- emergencyContactNo
- presentAddress
- permanentAddress
- profileImage
- managementDepartment
- isDeleted
- createdAt
- updatedAt

### Academic Semester:

- \_id

- name
- year
- code
- startMonth
- endMonth
- createdAt
- updatedAt

### Academic Faculty:

- \_id
- name
- createdAt
- updatedAt

### - Academic Department:

- \_id
- name
- academicFaculty
- createdAt
- updatedAt
