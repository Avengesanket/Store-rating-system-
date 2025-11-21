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
git clone https://github.com/Avengesanket/store-rating-system.git
cd store-rating-system
```
### 2. Backend Setup
```bash
cd backend
npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs @nestjs/typeorm typeorm pg @nestjs/config @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt class-validator class-transformer
npm install --save-dev @types/bcrypt @types/passport-jwt
```
#### Configure Environment Variables:
Create a .env file in the backend folder:
```Env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_db_password
DB_NAME=store_rating_db
JWT_SECRET=your_super_secret_key
```
#### Run Backend:
```Bash
npm run start:dev
```

### 3. Frontend Setup
Open a new terminal:
```Bash
cd frontend
npm install react-router-dom axios react-hook-form @hookform/resolvers zod lucide-react
npm install -D tailwindcss3 postcss autoprefixer
npx tailwindcss init -p
```

#### Run Frontend:
```Bash
npm run dev
```

Access the app at http://localhost:5173

## 🔑 Default Login Credentials
After running the backend for the first time, use these credentials to log in as the System Administrator:
- Email: admin@store.com
- Password: Admin@123

## 📸 Usage Guide
- Admin Setup: Log in with the default credentials. Go to the Dashboard.
- Create Owner: Click "Add User" -> Select Role: Store Owner.
- Create Store: Click "Add Store" -> Enter details -> Assign the newly created Owner.
- User Flow: Sign up as a Normal User -> Login -> Rate the new store.
- Owner Flow: Log in as the Store Owner -> View the new rating on the dashboard.

<img width="905" height="425" alt="image" src="https://github.com/user-attachments/assets/7d45e9da-ec89-4773-8c46-3ae8595462fc" />

<img width="913" height="422" alt="image" src="https://github.com/user-attachments/assets/e7fd709e-25a0-4da3-b415-1eb4bcdb69c0" />

<img width="910" height="424" alt="image" src="https://github.com/user-attachments/assets/16969483-cd3e-4f12-ad2e-328213d224a2" />

<img width="910" height="424" alt="image" src="https://github.com/user-attachments/assets/793ad8e5-e08d-430d-a857-a7c2007dd8d8" />

