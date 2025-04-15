# CS-1660 Project Frontend

This repository contains the frontend for the Scufftube Video Platform.

Scufftube is a video platform designed to allow users to view and interact with video content created by other users, as well as upload their own content.

Below, you will find details about setting up the project for local development, technical details, and an architecture diagram for the project as a whole.

---

## Table of Contents

- [Architecture](#architecture)
- [Technical Details](#technical-details)
- [Setup for Local Development](#setup-for-local-development)

---

## Architecture

![Architecture diagram](architecture_diagram.svg)

---

## Technical Details

This project is built using the [React](https://reactjs.org) framework for creating a dynamic and responsive user interface. Below are the key technologies and services used in this frontend:

- **React**: Provides the core framework for building reusable UI components and managing application state.
- **Vite**: A fast build tool and development server used for bundling and serving the application during development and production.
- **MUI (Material-UI)**: A React component library used for implementing a consistent and minimalist design system.
- **Firebase SDK**: Used for user authentication via Google, enabling secure login and session management.
- **React Router**: Handles client-side routing, enabling navigation between different pages of the application without reloading.
- **React Player**: A library for embedding and controlling video playback within the application.

This frontend is designed to integrate seamlessly with the backend API, providing features such as video uploads, playback, comments, likes, and user interactions.

---

## Setup for Local Development

Follow these steps to set up the project for local development:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/benjamin-kiddie/CS-1660-Project-Frontend.git
   cd CS-1660-Project-Frontend
   ```  

2. **Install Dependencies**:
  Ensure you have [Node.js](https://nodejs.org) installed. Then run:
    ```bash
    npm install
    ```

3. **Run Backend API**:
  Ensure the [backend API](https://github.com/benjamin-kiddie/CS-1660-Project-Backend) is running locally.

4. **Run the Development Server**:
  Start the development server using npm:
    ```bash
    npm run dev
    ```

5. **Access the Application**:
  Open your browser and navigate to `http://localhost:5173`.

---