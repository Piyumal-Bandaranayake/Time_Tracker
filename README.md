
# ⏳ Next Gen Task Tracker



T

> **Master Your Productivity with Precision.**
>
> A premium, glassmorphic personal task and time tracker designed for professionals who value every second. Manage tasks, track progress, and optimize your workflow in one sleek interface.

## ✨ Features

- **🎨 Premium UI/UX:** Stunning glassmorphic design with fluid animations and responsive layouts.
- **✅ Task Management:** Create, organize, and prioritize tasks effortlessly.
- **⏱️ Precision Time Tracking:** Track time spent on individual tasks with start/stop functionality and duration logging.
- **📊 Real-time Analytics:** Visualize your time allocation and productivity trends (Weekly Dashboard).
- **🔒 Secure Authentication:** Robust user registration and login system using JWT and Bcrypt.
- **📱 Fully Responsive:** Access your dashboard seamlessly from any device.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL installed and running

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/task-tracker.git
    cd task-tracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add your database connection string and other secrets:

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    JWT_SECRET="your-super-secret-jwt-key"
    ```

4.  **Database Setup:**
    Run Prisma migrations to create the database schema:

    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run the application:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
task-tracker/
├── app/                  # Next.js App Router pages and API routes
│   ├── api/              # Backend API endpoints (Auth, Tasks, Dashboard)
│   ├── Dashboard/        # User Dashboard page
│   ├── login/            # Authentication pages
│   ├── tasks/            # Task management pages
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── lib/                  # Utility functions (Prisma client, Auth helpers)
├── prisma/               # Database schema and migrations
│   └── schema.prisma
├── public/               # Static assets
└── ...config files       # Next.js, Tailwind, TypeScript configs
```

## 🗄️ Database Schema

The application uses a relational database with the following main models:

- **User:** Stores account information (email, password).
- **Task:** Represents a user's task with title, description, and completion status.
- **TimeEntry:** Logs specific time intervals spent on a task.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and Tailwind CSS.
