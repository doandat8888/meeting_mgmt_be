# MEETING_MGMT APPLICATION

# meeting-mgmt-jwat Postman Collection

This Postman collection is for managing users and meetings, including authentication, user management, meeting scheduling, and file uploads via Cloudinary.

## Collection Information

- **Collection Name:** meeting-mgmt-jwat
- **Schema:** [Postman Collection Schema v2.1.0](https://schema.getpostman.com/json/collection/v2.1.0/collection.json)
- **Postman ID:** 36b98387-3a7a-4099-8852-fdcbe70fd30f
- **Exporter ID:** 17845214

## Folders and Requests

### Users

1. **Get All Users**
   - **Method:** GET
   - **URL:** `http://localhost:3000/users`
   - **Auth:** Bearer Token
   - **Description:** Retrieves a list of all users.

2. **Refresh Token**
   - **Method:** GET
   - **Description:** Endpoint to refresh authentication token.

3. **Create New User**
   - **Method:** POST
   - **URL:** `http://localhost:8000/auth/register`
   - **Body:** 
     ```json
     {
       "email": "loi.tran.clv@gmail.com",
       "password": "123456",
       "fullName": "Tran Duc Loi"
     }
     ```
   - **Description:** Registers a new user.

4. **Login**
   - **Method:** POST
   - **URL:** `http://localhost:8000/auth/login`
   - **Body:**
     ```json
     {
       "email": "loi.tran.clv@gmail.com",
       "password": "123456"
     }
     ```
   - **Description:** Authenticates a user and provides a token.

5. **Get Current User**
   - **Method:** GET
   - **URL:** `http://localhost:8000/users/profile`
   - **Auth:** Bearer Token
   - **Description:** Retrieves the current user's profile.

6. **Update User Info**
   - **Method:** PATCH
   - **URL:** `http://localhost:8000/users/thy.tran.clv@gmail.com`
   - **Body:**
     ```json
     {
       "fullName": "Tran Hoang Thanh Thy"
     }
     ```
   - **Description:** Updates the specified user's information.

7. **Refresh Token**
   - **Method:** POST
   - **URL:** `http://localhost:8000/auth/refresh-token`
   - **Body:**
     ```json
     {
       "refreshToken": "token_string"
     }
     ```
   - **Description:** Refreshes the user's authentication token.

8. **Search Users**
   - **Method:** GET
   - **URL:** `http://localhost:8000/users/filter?email=d`
   - **Description:** Searches for users by email.

9. **Soft Delete User**
   - **Method:** DELETE
   - **URL:** `http://localhost:8000/users/81ba4fc2-6e7f-4e96-baec-152efe3c7d10`
   - **Description:** Soft deletes a user by ID.

10. **Restore User**
    - **Method:** GET
    - **URL:** `http://localhost:8000/users/recover/81ba4fc2-6e7f-4e96-baec-152efe3c7d10`
    - **Description:** Restores a soft-deleted user by ID.

### Meetings

1. **Add New Meeting**
   - **Method:** POST
   - **URL:** `http://localhost:8000/meetings`
   - **Body:**
     ```json
     {
       "title": "CPS Kickoff",
       "type": "Project Kickoff",
       "description": "Initial meeting to discuss project kickoff.",
       "note": "Bring all necessary documents.",
       "startTime": "2024-06-01T05:40:18.982Z",
       "endTime": "2024-06-01T06:40:18.982Z",
       "location": "Conference Room 1"
     }
     ```
   - **Description:** Schedules a new meeting.

2. **Soft Delete Meeting**
   - **Method:** DELETE
   - **URL:** `http://localhost:8000/meetings/delete/0630bd5d-a045-4c97-bbc7-d8638a7d8ef9`
   - **Description:** Soft deletes a meeting by ID.

3. **Find Meeting**
   - **Method:** GET
   - **URL:** `http://localhost:8000/meetings/0630bd5d-a045-4c97-bbc7-d8638a7d8ef9`
   - **Description:** Retrieves a meeting by ID.

4. **Update Meeting**
   - **Method:** PATCH
   - **URL:** `http://localhost:8000/meetings/0630bd5d-a045-4c97-bbc7-d8638a7d8ef9`
   - **Body:**
     ```json
     {
       "title": "CARIS Kickoff"
     }
     ```
   - **Description:** Updates meeting details.

5. **Restore Meeting**
   - **Method:** GET
   - **URL:** `http://localhost:8000/meetings/recover/0630bd5d-a045-4c97-bbc7-d8638a7d8ef9`
   - **Description:** Restores a soft-deleted meeting by ID.

6. **Find Meeting by Params**
   - **Method:** GET
   - **URL:** `http://localhost:8000/meetings/filter?title=p`
   - **Description:** Finds meetings based on query parameters.

### Cloudinary

1. **Upload File**
   - **Method:** POST
   - **URL:** `http://localhost:8000/cloudinary/upload`
   - **Body:** Form-data with file field containing the file path.
   - **Description:** Uploads a file to Cloudinary.

---

