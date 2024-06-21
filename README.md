# Postman Collection: meeting-mgmt-jwat

## Users

### Get all users

- **Description**: Retrieves all users from the server.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/users`

### Refresh Token

- **Description**: Refreshes the authentication token.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/auth/refresh-token`

### Create New User

- **Description**: Registers a new user.
- **Request**: 
  - Method: POST
  - URL: `http://localhost:8000/auth/register`
  - Body: 
    ```json
    {
        "email": "thy.tran.clv@gmail.com",
        "password": "123456",
        "fullName": "Tran Hoang Thanh Thy"
    }
    ```

### Login

- **Description**: Logs in an existing user.
- **Request**: 
  - Method: POST
  - URL: `http://localhost:8000/auth/login`
  - Body: 
    ```json
    {
        "email": "dat.doan.clv@gmail.com",
        "password": "123456"
    }
    ```

### Get Current User

- **Description**: Retrieves details of the currently authenticated user.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/users/profile`

### Update User Info

- **Description**: Updates information of a specific user.
- **Request**: 
  - Method: PATCH
  - URL: `http://localhost:8000/users/0780c676-e7fe-4cf3-b28a-2e39889baf76`
  - Body: 
    ```json
    {
        "fullName": "Tran Hoang Thanh Thy"
    }
    ```
### Refresh Token

- **Description**: Refresh the access token
- **Request**: 
  - Method: PATCH
  - URL: `http://localhost:8000/users/0780c676-e7fe-4cf3-b28a-2e39889baf76`
  - Body: 
    ```json
    {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5naGlhLm5nby5jbHZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE2OTkxMDA4LCJleHAiOjE3MTc1OTU4MDh9.jvBH0sDLGiSM26rgB8qyonDwnQ7RTlGgEF8R"
    }
    ```

### Search Users

- **Description**: Filter user by any parameters.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/users/filter?email=d`

### Soft Delete User

- **Description**: Soft deletes a user.
- **Request**: 
  - Method: DELETE
  - URL: `http://localhost:8000/users/81ba4fc2-6e7f-4e96-baec-152efe3c7d10`

### Restore User

- **Description**: Restores a previously soft deleted user.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/users/recover/81ba4fc2-6e7f-4e96-baec-152efe3c7d10`

### Get User by ID

- **Description**: Retrieves a user by their unique id.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/users/1382e73e-9122-4f9c-8e33-66457945b6a8`

## Meetings

### Add New Meeting

- **Description**: Creates a new meeting.
- **Request**: 
  - Method: POST
  - URL: `http://localhost:8000/meetings`
  - Body: 
    ```json
    {
        "title": "CPS Kickoff",
        "tag": "meeting",
        "description": "Initial meeting to discuss project kickoff.",
        "note": "Bring all necessary documents.",
        "startTime": "2024-06-01T07:20:00.982Z",
        "endTime": "2024-06-01T08:20:00.982Z",
        "location": "Conference Room 1"
    }
    ```

### Soft Delete Meeting

- **Description**: Soft deletes a meeting.
- **Request**: 
  - Method: DELETE
  - URL: `http://localhost:8000/meetings/delete/0630bd5d-a045-4c97-bbc7-d8638a7d8ef9`

### Find Meeting

- **Description**: Retrieves details of a specific meeting.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/meetings/b972488b-13b4-4357-9cd3-38059093e675`

### Update Meeting
- **Description**: Updates details of a specific meeting.
- **Request**: 
  - Method: PATCH
  - URL: `http://localhost:8000/meetings/0630bd5d-a045-4c97-bbc7-d8638a7d8ef9`
  - Body: 
    ```json
    {
        "title": "CARIS Kickoff"
    }
    ```

### Restore Meeting

- **Description**: Restores a previously soft deleted meeting.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/meetings/recover/0630bd5d-a045-4c97-bbc7-d8638a7d8ef9`

### Find Meeting by Params

- **Description**: Retrieves meetings filtered by parameters.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/meetings/filter?createdBy=1382e73e-9122-4f9c-8e33-66457945b6a8`

### Get Current Meeting

- **Description**: Retrieves details of the current meeting.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/meetings/current`

### Get All Meetings

- **Description**: Retrieves details of all meetings.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/meetings`

## Cloudinary

### Upload File

- **Description**: Uploads a file to Cloudinary.
- **Request**: 
  - Method: POST
  - URL: `http://localhost:8000/cloudinary/upload`
  - Body: Form data with file upload.

### Delete File

- **Description**: Deletes a file from Cloudinary.
- **Request**: 
  - Method: DELETE
  - URL: `http://localhost:8000/cloudinary?publicId=file_n9qdyx&type=pdf`

## User Meetings

### Add User to Meeting

- **Description**: Adds a user to a meeting.
- **Request**: 
  - Method: POST
  - URL: `http://localhost:8000/usermeetings`
  - Body: 
    ```json
    {
        "userId": "3efedaa4-e746-4808-902f-994ad9c4ff90",
        "meetingId": "af3464cc-d3ec-4810-bae9-018456efdca3"
    }
    ```

### Get Attendees of the Meeting

- **Description**: Retrieves attendees of a specific meeting.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/usermeetings/attendees/af3464cc-d3ec-4810-bae9-018456efdca3`

### Get Meetings Attended

- **Description**: Retrieves meetings attended by the current user.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/usermeetings/meetings/attend`

## Files

### Create New File

- **Description**: Creates a new file associated with a meeting.
- **Request**: 
  - Method: POST
  - URL: `http://localhost:8000/files`
  - Body: 
    ```json
    {
        "name": "file_rfdag0",
        "type": "pdf",
        "link": "https://res.cloudinary.com/dblglqzca/image/upload/v1717401196/file_rfdag0.pdf",
        "meetingId": "af3464cc-d3ec-4810-bae9-018456efdca3",
        "public_id": "f234an5"
    }
    ```

### Get Files of the Meeting

- **Description**: Retrieves files associated with a specific meeting.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/files/af3464cc-d3ec-4810-bae9-018456efdca3`

### Update File

- **Description**: Updates details of a specific file.
- **Request**: 
  - Method: PATCH
  - URL: `http://localhost:8000/files/61a0191a-9f32-43b9-98cb-7fb7dd79bc3a`
  - Body: 
    ```json
    {
      "name": "file2"
    }
    ```

### Delete File

- **Description**: Deletes a specific file.
- **Request**: 
  - Method: DELETE
  - URL: `http://localhost:8000/files/3e3623ba-20db-4861-b562-bb22f702fb81`

## Meeting Minutes

### Get Latest Meeting Minutes

- **Description**: Retrieves the latest meeting minutes.
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/meetingminutes/latest/af3464cc-d3ec-4810-bae9-018456efdca3`

### Get Current Meeting Minutes

- **Description**: Retrieves all meeting minutes of the current user
- **Request**: 
  - Method: GET
  - URL: `http://localhost:8000/meetingminutes/current`

### Delete Meeting Minutes

- **Description**: Delete meeting minutes by id.
- **Request**: 
  - Method: DELETE
  - URL: `http://localhost:8000/meetingminutes/f8260700-7416-46e1-9cdc-929d0597418a`

### Create New Meeting Minutes

- **Description**: Creates a new meeting minutes
- **Request**: 
  - Method: POST
  - URL: `http://localhost:8000/meetingminutes`
  - Body: 
    ```json
    {
      "name": "file_rfdag0",
      "link": "https://res.cloudinary.com/dblglqzca/image/upload/v1717401196/file_rfdag0.pdf",
      "meetingId": "af3464cc-d3ec-4810-bae9-018456efdca3",
      "public_id": "f234an5"
    }
    ```

