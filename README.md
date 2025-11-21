# Store Rating System 🌟

A full-stack web application that allows users to browse stores and submit ratings. The platform features a role-based system including System Administrators, Store Owners, and Normal Users.

## 🚀 Features

### 🛡️ System Administrator
*   **Dashboard:** View statistics (Total Users, Stores, Ratings).
*   **User Management:** Create, Update, Delete, and Filter users (Admin, Store Owner, Normal).
*   **Store Management:** Create, Update, Delete stores and assign them to Store Owners.
*   **Search:** Global search/filter capability for all lists.

### 🏪 Store Owner
*   **My Store Dashboard:** View average rating and total reviews for their assigned store.
*   **Reviews:** Read customer reviews and see who submitted them.
*   **Security:** Ability to change password.

### 👤 Normal User
*   **Browse:** Search and view a list of all registered stores.
*   **Rate:** Submit ratings (1-5 stars) for stores.
*   **Modify:** Update their previously submitted ratings.
*   **Profile:** Sign up and change password.

---

## 🛠️ Tech Stack

### Backend
*   **Framework:** NestJS
*   **Database:** PostgreSQL
*   **ORM:** TypeORM
*   **Authentication:** JWT & Passport
*   **Language:** TypeScript

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS
*   **State/API:** Axios, React Context API
*   **Forms:** React Hook Form + Zod Validation
*   **Icons:** Lucide React

---

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL (Running locally or via Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/store-rating-system.git
cd store-rating-system
