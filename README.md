# CS-1660 Project Frontend

This repository contains the frontend for the Scufftube Video Platform.

Scufftube is a video platform designed to allow users to view and interact with video content created by other users, as well as upload their own content.

Below, you will find details about setting up the project for local development, technical details, and an architecture diagram for the project as a whole.

---

## Table of Contents
- [Architecture](#architecture)
- [Technical Details](#technical-details)
- [Setup for Local Development](#setup-for-local-development)
- [Project Structure](#project-structure)

---

## Architecture
![Architecture diagram](architecture_diagram.svg)

---

## Technical Details
This project uses the [React](https://reactjs.org) framework and is built using the [Vite](https://vitejs.dev).

This project makes liberal use of [MUI components](https://mui.com) for consistent, minimalist presentation.

This project also uses the [Firebase SDK](https://firebase.google.com/) for authentication via Google.

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