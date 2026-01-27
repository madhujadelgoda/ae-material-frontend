# Resource Control Frontend

A role-based resource and material management system built with Angular for enterprise operational workflows.

This frontend application provides administrators and operational staff with secure, permission-driven access to inventory allocation, usage tracking, audits, and ERP-integrated workflows.

This application delivers:

- Role-Based Access Control (RBAC) UI enforcement
- Permission-aware navigation and actions
- Material allocation and return workflows
- Locator-based inventory management
- Team assignment system
- Admin dashboards and statistics
- User, Role & Permission management panels
- Security audit trail viewing
- JWT-based session handling
- Route-guarded enterprise navigation

---

## Tech Stack

- **Angular (Standalone Components)**
- **TypeScript**
- **RxJS**
- **Angular Router**
- **SCSS / CSS Variables**
- **Angular Material (Snackbar)**
- REST API integration
- JWT Authentication

---

## Design Philosophy

Enterprise systems succeed when:

- access is explicit
- actions are auditable
- permissions are enforced at every layer
- interfaces reflect backend authority
- workflows prevent mistakes before they happen

This frontend is intentionally designed to:

- mirror backend security rules
- hide unauthorized actions instead of merely blocking them
- provide fast operational feedback
- reduce risk during administrative operations
- scale with ERP integrations and multi-database environments

---

## Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI
- Backend API running

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resource-control-frontend

```

### 2. Install Dependencies

```bash
npm install

```

---

## Environment Configuration

Edit:

src/environments/environment.ts

Set the backend API URL:

```bash
export const environment = {
  apiUrl: 'http://localhost:8000/api'
};

```

---

## Running the Server

Start the development server with:

```bash
ng serve

```

Navigate to:

```
http://localhost:4200

```

---

## API Integration

This frontend communicates with the Resource Control backend API for:

* Authentication
* ERP integration endpoints
* Administrative CRUD services
* Material allocation flows
* Audit log retrieval
* Role & permission synchronization

---

## Permissions-Driven UI

The system enforces authorization using:

* Permission-based UI directives
* Route guards
* JWT-derived permission sets
* Sidebar menu filtering

This ensures:

> **No user can see or trigger an action they are not authorized to perform.**

---