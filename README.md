# DailyScribe - Blog Platform

DailyScribe is a full-stack blog platform built with Node.js, Express, and Prisma. It allows users to create posts, comment on posts, and manage their content.

## Features

- User authentication (signup/login with email)
- Create, read, and delete blog posts
- Comment on posts
- User profiles with recent posts and comments
- Responsive design using Bootstrap

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: EJS templates, Bootstrap 5
- **Authentication**: Session-based with bcrypt password hashing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/DailyScribe.git
cd DailyScribe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
DATABASE_URL="postgresql://username:password@localhost:5432/dailyscribe"
SESSION_SECRET="your-secret-key"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the server:
```bash
npm start
```

## Database Schema

### User Model
```prisma
model User {
  id       String    @id @default(uuid())
  email    String    @unique
  userName String
  password String
  posts    Post[]
  comments Comment[]
}
```

### Post Model
```prisma
model Post {
  id        String    @id @default(uuid())
  createdAt DateTime  @default(now())
  title     String
  content   String
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
}
```

### Comment Model
```prisma
model Comment {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
}
```

## Code Structure

```
DailyScribe/
├── controllers/         # Route controllers
│   ├── authController.js
│   ├── postController.js
│   └── userController.js
├── prisma/             # Database configuration
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── public/             # Static files
│   ├── styles/
│   └── js/
├── routes/             # Route definitions
├── views/              # EJS templates
│   ├── auth/
│   ├── partials/
│   └── *.ejs
├── app.js             # Express app configuration
└── package.json
```

## Authentication Flow

1. **Signup**:
   - User provides email, username, and password
   - Email uniqueness is checked
   - Password is hashed using bcrypt
   - User is created and session is initialized

2. **Login**:
   - User provides email and password
   - Email is used to find the user
   - Password is verified using bcrypt
   - Session is created with user data

3. **Protected Routes**:
   - Middleware checks for valid session
   - Unauthorized users are redirected to login

## Views and Templates

### Main Views
- `home.ejs`: Homepage with recent posts
- `post.ejs`: Individual post view with comments
- `profile.ejs`: User profile with posts and comments
- `userPosts.ejs`: List of user's posts
- `userComments.ejs`: List of user's comments

### Authentication Views
- `login.ejs`: Login form
- `signup.ejs`: Registration form

### Partials
- `header.ejs`: Navigation bar
- `footer.ejs`: Footer content
- `errorMsg.ejs`: Error message display
- `successMsg.ejs`: Success message display

## Seed Data

The project includes seed data for testing:
- Two test users (john@example.com and jane@example.com)
- Sample posts and comments
- Password for test users: "password123"

To run the seed:
```bash
npx prisma db seed
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.