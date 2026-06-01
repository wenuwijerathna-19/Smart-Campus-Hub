# Smart Campus Hub

## Overview

Smart Campus Hub is a full-stack campus management platform developed to improve the university experience by providing a centralized system for managing campus resources, bookings, support tickets, notifications, and student services.

The platform enables students to access campus facilities efficiently while providing administrators with tools to manage resources and monitor system activities.

## Features

### Authentication & User Management

* User Registration and Login
* JWT-Based Authentication
* Google OAuth Login
* Role-Based Access Control
* User Profile Management

### Resource Management

* Browse Available Resources
* Resource Details and Availability
* Resource Booking System
* Booking Management

### Ticket Management

* Create Support Tickets
* Track Ticket Status
* Ticket Resolution Workflow

### Notification System

* Real-Time User Notifications
* Booking Update Notifications
* Ticket Status Notifications
* Read/Unread Notification Management

### AI Assistant

* AI-Powered Student Support
* Intelligent Assistance Features

## Technologies Used

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Spring Boot
* Java
* Maven
* REST APIs

### Database

* MongoDB

### Authentication & Security

* JWT Authentication
* Google OAuth 2.0
* Spring Security

## System Architecture

```text
Client (React)
      │
      ▼
REST APIs
      │
      ▼
Spring Boot Backend
      │
      ▼
MongoDB Database
```

## Installation

### Clone Repository

```bash
git clone https://github.com/wenuwijerathna-19/Smart-Campus-Hub.git
```

### Backend Setup

```bash
cd api
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Team Project Information

This project was developed as a team project for the Programming Applications Frameworks (PAF) module.

### My Contribution

My primary responsibilities included:

* Authentication System Development
* JWT Authentication Implementation
* Google OAuth Integration
* Role-Based Access Control
* Notification System Development
* Notification API Integration
* Frontend-Backend Integration for Authentication and Notifications

Through this contribution, I gained hands-on experience in secure authentication, OAuth integration, REST API development, Spring Security, and full-stack application development.

## Learning Outcomes

* Spring Boot Development
* React Frontend Development
* REST API Design
* JWT Authentication
* Google OAuth Integration
* MongoDB Database Management
* Git & GitHub Collaboration
* Team-Based Software Development

## Future Improvements

* Mobile Application Integration
* Push Notifications
* Advanced Analytics Dashboard
* Resource Availability Prediction
* Enhanced AI Assistant Features

## Author

Wenushi Wijerathna

Information Technology Undergraduate
Sri Lanka Institute of Information Technology (SLIIT)

GitHub: https://github.com/wenuwijerathna-19

## License

This project is created for educational, academic, and portfolio purposes.
