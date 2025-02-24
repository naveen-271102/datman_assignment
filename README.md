# Merchant CRM System

A comprehensive Customer Relationship Management (CRM) system designed for managing merchant relationships, interactions, and tasks.

## Features

### 1. Merchant Management
- Add, view, edit, and delete merchants
- Track merchant details including:
  - Basic information (name, email, phone)
  - Address details
  - Status tracking
- Detailed merchant view with interaction history

### 2. Interaction Tracking
- Record different types of interactions:
  - Phone calls
  - Emails
  - Chat conversations
  - Other communications
- Link interactions to specific merchants
- Track interaction history with timestamps
- Add notes and details for each interaction

### 3. Task Management
- Create and assign tasks to team members
- Link tasks to specific interactions/merchants
- Set due dates and reminders
- Track task status (Pending, In Progress, Completed)
- Task filtering and sorting

### 4. User Management
- Create and manage user accounts
- Assign roles (Admin, Manager, Agent)
- Track user activities

## Technology Stack

### Frontend
- React.js 
- Redux Toolkit 
- Material-UI (MUI) 
- React Router 
- Axios 
- React-Toastify 

### Backend
- Node.js
- Express.js
- MongoDB 
- CORS support

## Setup & Configuration

### Prerequisites
- Node.js
- MongoDB 

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/naveen-271102/datman_assignment
   cd merchant-crm
   ```

2. **Backend Setup**
   ```bash
   cd backend

   # Install dependencies
   npm install

   # Create .env file
   cp .env.example .env

   # Update .env with your configuration
   MONGODB_URI=mongodb://localhost:27017/merchant-crm
   PORT=5000

   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend

   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/merchant-crm
PORT=5000
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

