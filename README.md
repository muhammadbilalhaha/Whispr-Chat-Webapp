# Whispr 💬

**Whispr** is a real-time chat web application built with a focus on **simplicity, speed, and usability**. It delivers the essential features of a modern chat app — instant messaging, image sharing, unread indicators, friend management, and admin tools — without unnecessary complexity or bloated dependencies.

The app is built on a full MERN-style stack (MongoDB, Express, React, Node.js) with Socket.IO handling live communication between clients. Messages are delivered instantly without needing a page refresh, and the interface updates in real time as friends come online, send messages, or share images.

Whispr was designed as a lean alternative to feature-heavy chat platforms — instead of trying to replicate every feature of apps like Discord or Slack, it focuses on getting the core chat experience right: fast delivery, clean UI, and straightforward account and friend management. Authentication is handled securely using JWTs stored in httpOnly cookies, so tokens are never exposed to client-side scripts. Images shared in conversations are uploaded directly to Cloudinary, keeping the backend lightweight and avoiding local file storage.

On top of the core chat experience, Whispr includes an admin layer for managing the platform itself — admins can view registered users, change roles, block or unblock accounts, and remove users when necessary, all from a dedicated dashboard. This makes Whispr a good fit not just as a personal project, but as a foundation for anyone looking to build or study a production-style real-time application with authentication, role-based access, and media handling built in.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- ⚡ **Real-time messaging** powered by Socket.IO
- 🔔 **Unread message counters** (similar to WhatsApp)
- 👥 **Friend management** — add, remove, and permanently delete conversations
- 🖼️ **Image message support** — stored and served via Cloudinary
- 🔐 **Secure authentication** — JWT stored in secure, `httpOnly` cookies
- 🛠️ **Admin dashboard** — manage user roles, block/unblock, and delete accounts
- 📱 **Fully responsive UI** — built purely with Tailwind CSS (no external UI libraries)
- 🧠 **Lightweight state management** — Zustand handles auth, friends, messages, and unread badges

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (JSX) | UI framework |
| Tailwind CSS | Styling |
| Zustand | State management |
| Socket.IO Client | Real-time communication |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO Server | Real-time messaging engine |
| Cloudinary | Image upload & storage |
| JWT | Authentication |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account for image uploads

### Installation

Clone the repository and install dependencies for both client and server:

```bash
git clone https://github.com/your-username/whispr.git
cd whispr

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Running the App

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm run dev
```

The app should now be running at `http://localhost:5173`, with the API available at `http://localhost:5001`.

---

## Usage

1. Register a new account or log in with existing credentials.
2. Add friends to start a conversation.
3. Send text and image messages in real time.
4. Unread message counts update live as new messages arrive.
5. Admin users can access the dashboard to manage roles and accounts.

---

## Roadmap

- [ ] Group chat support
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Push notifications
- [ ] Message search

> Update this list to reflect your actual plans — or remove it if not needed.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Created by **[Your Name]** — feel free to reach out via [your-email@example.com] or open an issue on this repository.
