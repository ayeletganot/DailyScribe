# DailyScribe 📝

**DailyScribe** is a personal journaling platform where users can share daily thoughts or experiences. It's a lightweight full-stack web app designed for simplicity and ease of use.

This project is part of my professional portfolio and currently in an early but functional stage.

---

## 🤖 AI Assistance

Some parts of this project were developed with the help of [Cursor AI](https://www.cursor.sh/), an AI coding assistant that helped speed up development and improve code quality.

---

## ✨ Features

- User signup and login with session-based authentication
- Secure password handling via `bcrypt`
- Create posts and comment on others
- Bootstrap-based responsive design
- EJS templating with Express.js
- PostgreSQL database

---

## 🔧 Tech Stack

- Backend: [Express.js](https://expressjs.com/)
- Views: [EJS](https://ejs.co/)
- Styling: [Bootstrap](https://getbootstrap.com/)
- Authentication: `bcrypt`, `express-session`
- Database: PostgreSQL (accessed via Prisma)

---

## 🚧 Status

DailyScribe is actively being developed.

✅ Main functionality works well  
🛠 Some features are still under construction:

- Minor bugs in edge cases still need refinement
- UI and validation will be improved over time

---

## 🛠 Getting Started

### Prerequisites

- Node.js installed
- PostgreSQL database
- `.env` file with the following:

        DATABASE_URL=your_postgres_url
        PORT=3000

###  Clone the repo
```bash
git clone https://github.com/ayeletganot/DailyScribe.git
cd dailyscribe

###Install dependencies:
npm install

###Set up the database:
npx prisma migrate dev --name init
npx prisma studio

###Start the app:
npm run start

###Visit http://localhost:3000 in your browser.