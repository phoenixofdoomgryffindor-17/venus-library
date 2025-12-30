# Venus Library - An AI-Powered Storytelling Platform

This is a Next.js application bootstrapped with Firebase Studio. It's an all-in-one platform for writers to create, publish, and sell their books with the help of generative AI.

## Getting Started

To get the application up and running on your local machine, follow the steps below.

### Prerequisites

Make sure you have Node.js (v18 or later) and npm installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1.  Open a terminal in the project's root directory.
2.  Run the following command to install all the required dependencies:

    ```bash
    npm install
    ```

### Running the Application

This project consists of two main parts: the Next.js web application and the Genkit AI flows. You'll need to run both for all features to work correctly.

1.  **Start the Web Application:**

    In your terminal, run:

    ```bash
    npm run dev
    ```

    This will start the Next.js development server. You can view your application by opening [http://localhost:3000](http://localhost:3000) in your browser.

2.  **Start the AI Services (Genkit):**

    The AI features (like content generation, critiques, etc.) are handled by Genkit. Open a **second terminal** in the same project directory and run:

    ```bash
    npm run genkit:dev
    ```

    This starts the Genkit development environment, allowing the web app to communicate with your AI flows.

## Available Scripts

-   `npm run dev`: Starts the Next.js application in development mode.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run start`: Starts the production server.
-   `npm run genkit:dev`: Starts the Genkit AI development server.
-   `npm run lint`: Runs the linter to check for code quality issues.
