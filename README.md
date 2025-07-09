# SimplySpent - Personal Expense Tracker

A modern, responsive web application for tracking personal expenses and managing budgets. Built with a clean, user-friendly interface and secure authentication.

## 🚀 Tech Stack

**Frontend:**
- React 19 with Vite
- Tailwind CSS 4.x for styling
- Axios for API communication
- React Router for navigation
- JWT authentication

**Backend:**
- Python Flask REST API
- SQLAlchemy ORM with SQLite (default)
- Flask-Migrate for database migrations
- JWT authentication with bcrypt
- CORS enabled for cross-origin requests

**Database:**
- SQLite (default, no setup required)

## 📋 Prerequisites

Before getting started, ensure you have:

- **Python 3.8+** (with pip)
- **Node.js 16+** (with npm)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd personal-expense-tracker
```

### 2. Backend Setup (Flask API)

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-Bcrypt Flask-CORS python-dotenv PyJWT

# Start the backend server (uses SQLite by default)
python app.py
# Backend runs on http://localhost:3001
```

**That's it!** The app will automatically create a SQLite database file at `backend/instance/expenses.db`.

### 3. Frontend Setup (React)

```bash
cd frontend/expense-tracker-frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

## 🎯 Features

- **User Authentication** - Secure JWT-based login/registration
- **Expense Tracking** - Add, edit, delete expenses with categories
- **Budget Management** - Create and manage multiple budgets
- **Category Goals** - Set spending targets for different categories
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Real-time Updates** - Instant feedback and data synchronization

## 📁 Project Structure

```
personal-expense-tracker/
├── backend/                    # Flask API server
│   ├── app.py                 # Main Flask application
│   ├── model.py               # SQLAlchemy models
│   ├── config.py              # Database configuration
│   ├── migrations/            # Database migration files
│   └── requirements.txt       # Python dependencies
├── frontend/expense-tracker-frontend/
│   ├── src/
│   │   ├── api/              # API service functions
│   │   ├── pages/            # React components/pages
│   │   ├── assets/           # Static assets
│   │   └── index.css         # Global styles & brand colors
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js        # Vite configuration
└── README.md
```

## 🎨 Brand Colors

SimplySpent uses a carefully crafted color system:

- **Primary**: Orange tones for CTAs and highlights
- **Secondary**: Deep green for navigation and headers  
- **Accent**: Pink for gradients and modern touches
- **Neutrals**: Grays for backgrounds and subtle elements
- **Semantic**: Success, warning, and error states

Colors are defined in `frontend/src/index.css` as CSS custom properties.

## 🔧 API Endpoints

**Authentication:**
- `POST /register` - Create new account
- `POST /login` - User login
- `PATCH /account` - Update account
- `DELETE /account` - Delete account

**Expenses:**
- `GET /expenses` - List user expenses
- `POST /expenses` - Create expense
- `GET /expenses/:id` - Get specific expense
- `PATCH /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

**Budgets:**
- `GET /budget` - List user budgets
- `POST /budget` - Create budget
- `GET /budget/:id` - Get specific budget
- `PATCH /budget/:id` - Update budget
- `DELETE /budget/:id` - Delete budget

**Category Goals:**
- `GET /category-goals/:budget_id` - Get goals for budget
- `POST /category-goals` - Create category goal
- `DELETE /category-goals/:id` - Delete category goal

## 🗄️ Database Configuration (Optional)

### Using SQLite (Default)
No configuration needed. The app automatically uses SQLite and creates the database file.

## 🚀 Development

**Backend Development:**
```bash
cd backend
source venv/bin/activate
python app.py  # Runs with hot reload in debug mode
```

**Frontend Development:**
```bash
cd frontend/expense-tracker-frontend
npm run dev  # Vite dev server with hot reload
```

**Database Migrations:**
```bash
cd backend
flask db migrate -m "Description of changes"
flask db upgrade
```

## 📦 Production Build

```bash
# Build frontend
cd frontend/expense-tracker-frontend
npm run build

# Backend is production-ready as-is
# Set environment variables and run with a WSGI server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
