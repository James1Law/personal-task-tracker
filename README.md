# Kanban Task Tracker

A modern, customizable Kanban board for tracking tasks, built with Next.js, React, and Tailwind CSS.

## Features

- 📝 Add, edit, and delete tasks (cards)
- 🏷️ Tag and prioritize tasks (e.g., Urgent, Medium, etc.)
- 📅 Due date tracking with overdue alerts and acknowledgment
- 🗂️ Drag-and-drop columns and cards
- 🎨 Customizable tags and priorities
- ⚡ Responsive, accessible, and fast UI
- ☁️ Ready for deployment on Vercel, Netlify, or your own server

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn if you prefer)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/James1Law/personal-task-tracker.git
cd personal-task-tracker
pnpm install
```

### Running Locally

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

- `app/` – Next.js app directory (routing, layout, etc.)
- `components/` – UI and feature components (Kanban board, dialogs, etc.)
- `hooks/` – Custom React hooks
- `lib/` – Utility functions
- `public/` – Static assets (images, icons)
- `styles/` – Global styles (Tailwind CSS)
- `types/` – TypeScript types

## Deployment

This project is ready to deploy on platforms like [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or any Node.js server.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

---

**Made with ❤️ by James Law**