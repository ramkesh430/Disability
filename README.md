# Disability Identity Card Management System

A comprehensive web-based application for managing disability identity cards with modern UI/UX, bilingual support, and complete workflow management.

## Features

### Frontend React Application with Modern UI/UX
- **Professional Design**: Clean, modern interface with responsive layout
- **User-Friendly Navigation**: Intuitive sidebar and header components
- **Interactive Components**: Modals, forms, and dynamic content
- **Real-time Updates**: Live data synchronization with backend
- **Loading States**: Professional loading indicators and spinners
- **Error Handling**: Comprehensive error messages and user feedback

### Backend FastAPI with SQLAlchemy ORM
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication & Authorization**: JWT-based security with role-based access
- **Database Integration**: SQLAlchemy ORM with MySQL database
- **Validation**: Pydantic schemas for request/response validation
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Audit Logging**: Complete tracking of all system activities

### MySQL Database with Proper Relationships
- **Normalized Schema**: Proper database design with foreign key constraints
- **Data Integrity**: Cascade operations and referential integrity
- **Migration Scripts**: Database setup and version control
- **Performance**: Optimized queries and indexing
- **Security**: Proper data validation and sanitization

### ID Card Generation and Printing Functionality
- **Card Generation**: Automated ID card creation from approved applications
- **Bilingual Cards**: English and Nepali language support
- **Print Layout**: A4 page layout with proper formatting
- **QR Code Integration**: Unique QR codes for each card
- **Photo Management**: Image upload and processing
- **Print Tracking**: Status tracking for printed cards

### Duplicate Requests Management System
- **Request Creation**: Easy duplicate request submission
- **Approval Workflow**: Admin approval/rejection system
- **Status Tracking**: Real-time status updates
- **Reason Management**: Predefined reasons for duplicate requests
- **Audit Trail**: Complete history of duplicate requests
- **Integration**: Seamless integration with ID cards page

### Application CRUD Operations
- **Complete CRUD**: Create, Read, Update, Delete operations
- **Search & Filter**: Advanced search capabilities
- **Bulk Operations**: Multiple record management
- **Validation**: Form validation and error handling
- **Status Management**: Application lifecycle tracking
- **Document Management**: File upload and storage

### Ward and Committee Review System
- **Multi-level Review**: Ward and committee approval workflow
- **Review Comments**: Detailed feedback and remarks
- **Status Tracking**: Real-time review status
- **User Assignment**: Reviewer assignment and notifications
- **Audit Logging**: Complete review history
- **Decision Management**: Approval/rejection with reasons

### Bilingual Support (English/Nepali)
- **Dual Language**: Complete English and Nepali interface
- **Localized Content**: Proper Nepali translations
- **Font Support**: Nepali font rendering
- **Switchable Interface**: Language toggle functionality
- **Cultural Adaptation**: Local formatting and conventions
- **Accessibility**: Proper character encoding and display

### Authentication and Authorization
- **JWT Security**: Secure token-based authentication
- **Role-Based Access**: Admin, committee member, and ward roles
- **Session Management**: Secure session handling
- **Password Security**: Hashed passwords with bcrypt
- **Access Control**: Route protection and permissions
- **User Management**: Complete user administration

### Responsive Design and Professional Styling
- **Mobile Responsive**: Works on all device sizes
- **Modern CSS**: Professional styling with animations
- **Component Library**: Reusable UI components
- **Theme Support**: Consistent color scheme and branding
- **Accessibility**: WCAG compliant design
- **Performance**: Optimized for fast loading

## Technology Stack

### Frontend
- **React 18.3.1** - Modern JavaScript framework
- **React Router 6.26.0** - Client-side routing
- **Axios 1.7.2** - HTTP client for API calls
- **React Icons 5.4.0** - Icon library
- **CSS3** - Modern styling with animations

### Backend
- **FastAPI 0.115.0** - Modern Python web framework
- **SQLAlchemy 2.0.35** - Python SQL toolkit
- **PyMySQL 1.1.1** - MySQL database connector
- **Uvicorn 0.30.6** - ASGI server
- **Pydantic** - Data validation and serialization

### Database
- **MySQL 8.0** - Relational database management
- **InnoDB Engine** - Transactional storage engine
- **Foreign Keys** - Data integrity constraints

### Authentication
- **JWT (JSON Web Tokens)** - Secure authentication
- **bcrypt** - Password hashing
- **Python-jose** - JWT implementation

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/ramkesh430/Disability.git
cd Disability/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Set up database**
```bash
mysql -u root -p < database_setup.sql
```

6. **Run the backend server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

### Default Credentials
- **Username**: `testuser`
- **Password**: `testpass123`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Application Management
- `GET /api/applications/` - List applications
- `POST /api/applications/` - Create application
- `GET /api/applications/{id}` - Get application details
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application

### ID Card Management
- `GET /api/id-cards/` - List ID cards
- `POST /api/id-cards/` - Generate ID card
- `GET /api/id-cards/{id}` - Get ID card details
- `POST /api/id-cards/{id}/mark-printed` - Mark card as printed

### Duplicate Requests
- `GET /api/duplicate-requests/` - List duplicate requests
- `POST /api/duplicate-requests/` - Create duplicate request
- `POST /api/duplicate-requests/{id}/approve` - Approve request
- `POST /api/duplicate-requests/{id}/reject` - Reject request

### Review System
- `GET /api/ward-reviews/` - List ward reviews
- `POST /api/ward-reviews/` - Create ward review
- `GET /api/committee-reviews/` - List committee reviews
- `POST /api/committee-reviews/` - Create committee review

## Deployment

### Vercel Deployment (Backend)

1. **Connect repository to Vercel**
2. **Configure environment variables**
3. **Deploy automatically**

The project includes Vercel configuration files:
- `main.py` - Entrypoint for Vercel
- `vercel.json` - Vercel configuration
- `requirements.txt` - Python dependencies

### Frontend Deployment

The frontend can be deployed to any static hosting service:
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect repository
- **GitHub Pages**: Use GitHub Actions

## Database Schema

### Core Tables
- **users** - User authentication and roles
- **applications** - Disability applications
- **id_cards** - Generated ID cards
- **duplicate_requests** - Duplicate request management
- **ward_reviews** - Ward review records
- **committee_reviews** - Committee review records
- **audit_logs** - System activity logging

### Relationships
- Users have roles and permissions
- Applications belong to users
- ID cards are generated from applications
- Reviews are linked to applications
- Audit logs track all activities

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt encryption
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Pydantic schema validation
- **SQL Injection Prevention**: SQLAlchemy ORM
- **Audit Logging**: Complete activity tracking

## Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## Screenshots

### Dashboard
- Overview of system statistics
- Quick access to main functions
- Real-time data updates

### Application Management
- Complete CRUD operations
- Advanced search and filtering
- Status tracking and management

### ID Card Generation
- Automated card creation
- Bilingual card preview
- Print-ready layouts

### Review System
- Multi-level approval workflow
- Comments and feedback
- Status tracking

## Future Enhancements

- **Mobile App**: React Native mobile application
- **Email Notifications**: Automated email alerts
- **Reporting System**: Advanced analytics and reports
- **API Rate Limiting**: Enhanced API security
- **Multi-tenant Support**: Multiple organization support
- **Advanced Search**: Full-text search capabilities

---

**Developed with modern web technologies and best practices for accessibility and security.**
