## 🛠️ server_template

A clean, scalable Express.js server template with authentication, error handling, and modular routing. Built for clarity, maintainability, and developer experience.

---

## 🚀 Features

- 🔐 JWT-based authentication with access & refresh tokens
- 🧾 Input validation via Zod
- 🍪 Secure cookie handling
- 📦 MongoDB user schema with timestamps
- 🧼 Centralized error handling
- 📊 Logging via Morgan
- 🌐 CORS-enabled API
- 🧪 Test endpoint for health checks

---

## 📌 API Endpoints

All routes are prefixed with /api/v1/auth

| Method | Endpoint  | Description                 | Middleware |
| ------ | --------- | --------------------------- | ---------- |
| POST   | /register | Register a new user         | —          |
| POST   | /login    | Log in and receive tokens   | —          |
| GET    | /user     | Get authenticated user info | verify     |
| DELETE | /logout   | Log out and clear cookies   | verify     |
| GET    | /test     | Health check endpoint       | —          |

---

## 🔐 Environment Variables

Create a .env file in the root of your project and include the following:

APP_PORT=3000  
APP_DB_URI=mongodb://localhost:27017/your-db-name  
APP_ACCESS_TOKEN_KEY=your-access-token-secret  
APP_REFRESH_TOKEN_KEY=your-refresh-token-secret

| Variable              | Purpose                               |
| --------------------- | ------------------------------------- |
| APP_PORT              | Port on which the server will run     |
| APP_DB_URI            | MongoDB connection string             |
| APP_ACCESS_TOKEN_KEY  | Secret key for signing access tokens  |
| APP_REFRESH_TOKEN_KEY | Secret key for signing refresh tokens |

💡 Make sure to keep your .env file out of version control by adding it to .gitignore.

---

## 🧪 Validation

- Uses Zod schemas for register and login inputs
- Friendly error formatting via z.prettifyError

---

## 🧱 User Schema

```ts
{
  username: String (required, lowercase),
  email: String (required, lowercase, indexed),
  passwordHash: String (required),
  timestamps: { createdAt: true, updatedAt: false }
}
```

---

## 🏁 Getting Started

Install dependencies:
npm install

Start the server:
npm run dev

---

## 📣 Notes

- CORS is currently set to origin: "\*" — update this for production
- Tokens are stored in HTTP-only cookies for security
- Stack traces are captured conditionally for cross-runtime compatibility

---

## 👨‍💻 Author

Made with care by Khaim Michael Altiz 💙
GitHub: https://github.com/KaymMikael
