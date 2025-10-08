# Pokémon Battler

Welcome to Pokémon Battler, a web application where you can build your dream team of Pokémon and test your skills in exciting battles!

## Description

This project is a full-stack web application built with Next.js that allows users to register, log in, select a team of Pokémon, and engage in battles against computer-controlled opponents. The application also features a leaderboard to track the highest scores.

## Features

- **User Authentication:** Secure user registration and login system.
- **Team Selection:** Choose a team of up to 6 Pokémon from the original 151.
- **Battle Arena:** A turn-based battle system against an AI opponent.
- **Leaderboard:** Compete with other players for the highest score.
- **Profile Customization:** Upload a custom profile picture.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Image Management:** [Cloudinary](https://cloudinary.com/)
- **Schema Validation:** [Zod](https://zod.dev/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20 or later)
- npm
- A running PostgreSQL instance

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your_username/pokemon-group-project.git
    cd pokemon-group-project
    ```

2.  **Install NPM packages:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables.

    ```env
    # Database URL
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"

    # Secret for session encryption
    SESSION_SECRET="your_secret_key_for_session_encryption"
    ```

4.  **Run database migrations:**
    ```sh
    npx prisma migrate dev
    ```

### Running the Application

To start the development server, run:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the codebase.

## Database Schema

The database schema is managed by Prisma. The main models are:

- `User`: Stores user information, including credentials and team roster.
- `Session`: Manages user sessions for authentication.
- `LeaderboardEntry`: Stores user scores for the leaderboard.

You can find the complete schema in the `prisma/schema.prisma` file.
