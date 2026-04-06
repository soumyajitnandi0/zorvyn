# Zorvyn — Premium Finance Dashboard

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366f1?style=for-the-badge&logo=vercel)](https://zorvyn-ten.vercel.app/)

**Zorvyn** is a sophisticated, high-end finance management dashboard designed to provide users with deep financial clarity through a "Neo-Bank" aesthetic. It features real-time data visualization, predictive insights, and robust role-based access control (RBAC).

---

## ✨ Key Features

- **🏆 Premium Experience**: An ultra-luxury design system featuring glassmorphism, floating panels, and smooth transitions.
- **📊 Interactive Dashboard**: High-performance charts powered by **Recharts** for real-time balance and spending analysis.
- **🧠 Intelligent Insights**: Automated monthly spending comparisons, top expense tracking, and recurring spend analysis.
- **💸 Transaction Suite**: A comprehensive management system with:
    - **Advanced Filtering**: Categorize and sort by date, amount, and type.
    - **Live Search**: Instant results across your entire financial history.
    - **Full CRUD**: Admins can add, edit, and delete transactions.
- **🎭 Role-Based Access Control (RBAC)**: Simulated permissions allowing seamless switching between **Viewer** (read-only) and **Admin** profiles.
- **🌗 Dark Mode & Persistence**: Full support for Light, Dark, and System modes with state persistence via `localStorage`.

---

## 🛠️ Tech Stack

- **Core**: [Next.js 14+](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with `persist` middleware)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/zorvyn.git
   cd zorvyn
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🏗️ Technical Decisions & Trade-offs

- **Zustand over Redux**: Selected for its minimal boilerplate and superior performance in small-to-medium finance apps. The built-in persistence ensures data integrity across sessions without a complex backend initialization.
- **Client-Side Simulation**: While the app feels like it has a real-time backend, it uses a centralized mock data store with state-driven logic. This showcases high-level frontend architecture while remaining a self-contained, easy-to-deploy assignment.
- **Mobile-First UX**: Every component, from the filter modals to the navigation dock, is built with responsive-first principles to ensure a premium experience on every device.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
