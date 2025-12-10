# GEMINI.md

This document provides a comprehensive overview of the QuizVerse project, its architecture, and development practices to be used as instructional context for future interactions.

## Project Overview

QuizVerse is a web-based, immersive 3D quiz game. It's built with Next.js and uses Supabase as its backend for data storage and authentication. The application presents users with various quiz categories, each associated with a unique 3D environment, to create an engaging and visually rich experience.

The core technologies used in this project are:

*   **Framework:** [Next.js](https://nextjs.org/) (with the App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Backend:** [Supabase](https://supabase.io/) (for database, authentication, and storage)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **3D Graphics:** [Three.js](https://threejs.org/) (with `@react-three/fiber` and `@react-three/drei`)
*   **UI Components:** A mix of custom components and components from a UI library (as seen in the `components/ui` directory).
*   **State Management:** The project appears to use a combination of React's built-in state management and potentially a client-side state management library for more complex state.

## Project Structure

The project follows the standard Next.js App Router structure:

*   `app/`: Contains the application's routes and pages.
    *   `app/layout.tsx`: The root layout of the application.
    *   `app/page.tsx`: The home page of the application.
    *   `app/auth/`: Contains the authentication-related pages (login, sign-up).
    *   `app/categories/`: Displays the available quiz categories.
    *   `app/play/[category]/`: The main quiz gameplay page.
    *   `app/leaderboard/`: Displays the game's leaderboard.
    *   `app/profile/`: The user's profile page.
*   `components/`: Contains reusable React components.
    *   `components/ui/`: Contains the UI components.
    *   `components/hero-scene.tsx`: The 3D scene on the home page.
    *   `components/quiz-game.tsx`: The main quiz game component.
*   `lib/`: Contains utility functions and the Supabase client.
    *   `lib/supabase/`: Contains the Supabase client for the browser and server.
*   `public/`: Contains static assets like images and icons.
*   `scripts/`: Contains SQL scripts for database initialization.

## Building and Running

The project uses `pnpm` as the package manager. The following scripts are available in `package.json`:

*   **`pnpm install`**: To install the project's dependencies.
*   **`pnpm dev`**: To start the development server. The application will be available at `http://localhost:3000`.
*   **`pnpm build`**: To build the application for production.
*   **`pnpm start`**: To start the production server.
*   **`pnpm lint`**: To run the ESLint linter.

## Development Conventions

*   **Coding Style:** The project uses TypeScript and follows standard React and Next.js conventions. ESLint is used to enforce code quality.
*   **Component-Based Architecture:** The application is built using a component-based architecture, with a clear separation between pages and reusable components.
*   **Data Fetching:** Data is fetched from the Supabase backend using the Supabase client. The project uses Next.js Server Components to fetch data on the server side.
*   **Styling:** Styling is done using Tailwind CSS. Utility classes are used to style the components.
*   **Database:** The project uses a PostgreSQL database managed by Supabase. The database schema is defined in the SQL scripts in the `scripts/` directory.
