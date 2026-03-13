# 🏋️‍♂️ FitWithAI: Intelligent Fitness Tracking & Analytics

![Hero Screenshot](https://github.com/AyushVibhute555/Fit-with-AI/blob/main/App_Photos/Home.png)
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

![Architecture Workflow Diagram](https://github.com/AyushVibhute555/Fit-with-AI/blob/main/App_Photos/Arc.png)

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


### Step 1: Start Required Services

#### RabbitMQ
Run RabbitMQ with the management dashboard using Docker:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

- AMQP Port: 5672  
- Management Dashboard: http://localhost:15672

---

#### Keycloak
Start the Keycloak authentication server using Docker:

```bash
docker run -p 8181:8080 \
-e KEYCLOAK_ADMIN=admin \
-e KEYCLOAK_ADMIN_PASSWORD=admin \
quay.io/keycloak/keycloak:26.0.0 start-dev
```

Keycloak Admin Console:  
http://localhost:8181

---

### Step 2: Configure Keycloak

1. Open the Keycloak Admin Console  
   http://localhost:8181

2. Create a new Realm  
   fitness-oauth2

3. Create a Client  
   oauth2-pkce-client

4. Enable setting:
   - Standard Flow Enabled

5. Configure frontend URLs

Valid Redirect URIs:
```
http://localhost:5173/*
```

Web Origins:
```
http://localhost:5173
```

6. Enable User Registration

Realm Settings → Login → Enable "User Registration"

---

### Step 3: Run the Microservices

IMPORTANT: Start services in this order

1. Eureka Server (wait until fully started)
2. Config Server (must connect to Eureka)
3. API Gateway
4. User Service
5. Activity Service
6. AI Service

If AI Service shows Gemini timeout error, add:

```
java.net.preferIPv4Stack=true
```

---

### Step 4: Run the Frontend

```
cd Fit-Frontend
npm install
npm run dev
```

Frontend URL:
```
http://localhost:5173
```

---

## 📸 Application Gallery

### Landing & Registration
Users see a premium landing page.  
Clicking Register redirects to Keycloak signup page.

### Activity Dashboard
Users can:
- Add workouts
- View activity history
- See activity grid

### AI Insights Detail Page
Clicking an activity shows AI report:
- Workout improvement
- Performance analysis
- Suggestions

---

## 👤 Author

Created by Ayush
