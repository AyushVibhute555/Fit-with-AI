# 🏋️‍♂️ FitWithAI: Intelligent Fitness Tracking & Analytics

![Hero Screenshot](link_to_your_hero_screenshot_here.png)
*A premium, full-stack microservices application for logging workouts and receiving personalized, AI-driven fitness insights.*

## 📖 Overview
FitWithAI is an industrial-grade fitness tracking platform. It allows users to securely log their physical activities (Running, Cycling, Walking) and leverages the power of Google's Gemini AI to analyze the data and generate highly personalized recommendations, improvement strategies, and safety guidelines. 

The application is built using a highly scalable **Spring Boot Microservices architecture** on the backend and a sleek, responsive **React + Material-UI** frontend.

---

## ✨ Key Features
* **Secure Authentication:** OAuth2 + PKCE flow managed by Keycloak.
* **Activity Tracking:** Log workout type, duration, and calories burned.
* **Asynchronous AI Processing:** Utilizes RabbitMQ to queue activity data, ensuring the AI Service processes requests reliably without blocking the user interface.
* **Generative AI Insights:** Integrates with Google Gemini to provide actionable feedback on workouts.
* **Premium UI/UX:** A dark-mode, glassmorphic React frontend built with Material-UI, Redux, and custom typography (Outfit & Saira).

---

## 🏗️ Architecture & Microservices
The backend is completely decoupled into independent, highly cohesive services:

![Architecture Workflow Diagram](link_to_your_workflow_diagram_here.png)

1. **API Gateway (`gateway`):** The single entry point for the frontend. Handles routing and enforces security/CORS.
2. **Service Registry (`eureka`):** Netflix Eureka server running on port `8761`. Allows microservices to find and communicate with each other dynamically.
3. **Config Server (`configserver`):** Centralized configuration management using the `native` profile to serve `.yml` files to all services.
4. **User Service (`userservice`):** Handles user synchronization with Keycloak.
5. **Activity Service (`activityservice`):** Manages CRUD operations for fitness activities and publishes messages to the message broker.
6. **AI Service (`aiservice`):** Listens to RabbitMQ queues, communicates with the Gemini API via WebClient, and saves AI insights back to the database.

---

## 🛠️ Tech Stack
* **Frontend:** React, Vite, React Router, Redux Toolkit, Material-UI (MUI), Axios, React-OAuth2-Code-PKCE.
* **Backend:** Java 22, Spring Boot 3.x, Spring Cloud (Gateway, Eureka, Config), Spring Data MongoDB.
* **Infrastructure/Security:** Keycloak (IAM), RabbitMQ (Message Broker), Docker.
* **AI Integration:** Google Gemini API.

---

## 🚀 Local Setup & Installation

### Prerequisites
* Java 22+
* Node.js & npm
* Docker Desktop
* A Google Gemini API Key

### Step 1: Start Infrastructure (Docker)
Start the essential infrastructure services using Docker:

**RabbitMQ:**
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
Keycloak:

Bash

docker run -p 8181:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.0.0 start-dev
Step 2: Configure Keycloak
Access the Keycloak Admin Console at http://localhost:8181.

Create a new realm named fitness-oauth2.

Create a client (e.g., oauth2-pkce-client) with standard flow enabled.

Add your frontend URL (http://localhost:5173) to Valid Redirect URIs and Web Origins.

Enable "User Registration" in Realm Settings -> Login.

Step 3: Run the Microservices
Crucial: Services must be started in the following order to resolve dependencies properly.

Eureka Server (Wait for startup)

Config Server (Ensure it connects to Eureka)

API Gateway

User Service, Activity Service, & AI Service (Note: Ensure your java.net.preferIPv4Stack=true property is set in the AI Service if you face Gemini DNS resolution timeouts).

Step 4: Run the Frontend
Navigate to the Fit-Frontend directory, install dependencies, and start the Vite development server:

Bash

cd Fit-Frontend
npm install
npm run dev
📸 Application Gallery
Landing & Registration
Users are greeted with a premium landing page. Clicking "Register" routes directly to Keycloak's dedicated signup flow.

Activity Dashboard
Users can log new workouts and view a grid of their historical activities.

AI Insights Detail Page
Clicking an activity pulls up an asynchronous, highly detailed AI report on how to improve the workout.

👤 Author
Created by Ayush


Once you have saved this file and added your screenshots to an `images/` folder, you just need to run the standard Git commands to push the update to GitHub:

```bash
git add .
git commit -m "Add detailed project README and screenshots"
git push
