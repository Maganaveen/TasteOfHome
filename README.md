# Taste of Home Backend

## Overview
The Taste of Home Backend is a Node.js application that provides authentication functionality for the Taste of Home project. It allows users to register and log in, managing user data securely.

## Project Structure
```
taste-of-home-backend
├── src
│   ├── controllers
│   │   └── authController.js
│   ├── routes
│   │   └── authRoutes.js
│   ├── models
│   │   └── user.js
│   └── app.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (for database)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd taste-of-home-backend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
1. Start the server:
   ```
   npm start
   ```
2. The server will run on `http://localhost:3000`.

### API Endpoints
- **POST /api/register**: Register a new user.
- **POST /api/login**: Log in an existing user.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.
