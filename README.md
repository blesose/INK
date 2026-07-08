# <img width="28" height="28" alt="image" src="https://github.com/user-attachments/assets/53d285f2-8a15-4655-bf88-bbab226cb789" />
INK

### Where ideas come to life.

A modern real-time collaborative workspace for drawing, brainstorming, and team communication.

## ✨ About INK

INK is a real-time collaborative workspace designed to help people think visually and work together from anywhere.

Users can create shared boards, draw ideas, exchange messages through integrated chat, organize thoughts using sticky notes, and collaborate in real time with synchronized cursor movement.

Rather than switching between multiple tools for communication and brainstorming, INK brings everything into one shared workspace.

The project was built as a personal engineering challenge to explore real-time application development using modern full-stack technologies such as React, TypeScript, Socket.IO, Prisma, and PostgreSQL.

## 💡 Why I Built INK

I wanted to challenge myself by building a real-time application from the ground up.

INK gave me the opportunity to work with technologies such as Socket.IO, Prisma, PostgreSQL, JWT authentication, and Google OAuth while solving problems around real-time synchronization, collaborative user experiences, and full-stack architecture.

Beyond learning the technologies themselves, the goal was to build a project that reflects how modern collaborative applications work in production.

## 🚀 Features

### 🎨 Real-Time Drawing
Draw on a shared canvas with updates synchronized instantly across connected users.

### 👥 Live Cursor Presence
See where collaborators are working through live cursor tracking.

### 💬 Integrated Team Chat
Communicate directly within each workspace without leaving the board.

### 📝 Sticky Notes
Capture ideas, organize thoughts, and collaborate visually using movable sticky notes.

### 📋 Room-Based Collaboration
Create or join shared workspaces using room codes.

### 🔐 Secure Authentication
Authenticate using email/password or Google OAuth.

### 🗂 Dashboard
Manage and organize all your collaborative boards from one place.

### 🌙 Dark & Light Theme
Choose the interface that matches your workflow.

### 📱 Responsive Design
Optimized for different screen sizes for a smooth experience.
## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React | Building the user interface |
| TypeScript | Type-safe frontend development |
| Vite | Fast development and build tooling |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Smooth animations |
| React Router | Client-side routing |
| Socket.IO Client | Real-time communication |

---

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express | REST API and server |
| TypeScript | Type-safe backend development |
| Socket.IO | Real-time communication |
| Prisma ORM | Database access |
| PostgreSQL (Neon) | Primary database |
| JWT | Authentication |
| Google OAuth 2.0 | Social login |

---

### Development Tools

| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub | Source code hosting |
| pnpm | Package manager |
| ESLint | Code quality |
## 🏗 Architecture

```text
                    ┌─────────────────────────────┐
                    │        React Client         │
                    │     (Vite + TypeScript)     │
                    └─────────────┬───────────────┘
                                  │
                 REST API + WebSocket (Socket.IO)
                                  │
                    ┌─────────────▼───────────────┐
                    │      Express Server         │
                    │      (Node + TypeScript)    │
                    └─────────────┬───────────────┘
                                  │
                            Prisma ORM
                                  │
                    ┌─────────────▼───────────────┐
                    │    PostgreSQL (Neon)        │
                    └─────────────────────────────┘
```

## 📂 Project Structure

```text
INK/
│
├── ink-client/          # React frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── ink-server/          # Express backend
│   ├── src/
│   ├── prisma/
│   └── ...
│
├── README.md
├── LICENSE
└── .gitignore
```


## ⚡ Getting Started

### Clone the repository

```bash
git clone https://github.com/blesose/INK.git
```

### Navigate into the project

```bash
cd INK
```

### Install frontend dependencies

```bash
cd ink-client
pnpm install
```

### Install backend dependencies

```bash
cd ../ink-server
pnpm install
```

### Start the frontend

```bash
cd ../ink-client
pnpm dev
```

### Start the backend

```bash
cd ../ink-server
pnpm dev
```

## 🔑 Environment Variables

Create a `.env` file inside the `ink-server` directory and configure the required environment variables.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:5173
```

> **Note:** Never commit your `.env` file to version control.
>## 🗺 Roadmap

- [x] Real-time collaborative drawing
- [x] Live cursor synchronization
- [x] Sticky notes
- [x] Workspace chat
- [x] JWT Authentication
- [x] Google OAuth
- [x] Dashboard
- [x] Dark & Light mode
- [ ] Multi-user simultaneous drawing testing
- [ ] Board sharing improvements
- [ ] Export boards as image/PDF
- [ ] User profiles
- [ ] Notification system
- [ ] Docker support

- [ ] ## 📄 License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for more information.
