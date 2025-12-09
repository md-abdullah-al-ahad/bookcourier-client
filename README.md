# 📚 BookCourier - Client Application

> A modern, full-stack library-to-home book delivery system built with React, providing seamless book browsing, ordering, and delivery tracking.

## 🌐 Live Demo

[Add deployment URL here]

## 📖 Description

BookCourier is a comprehensive book delivery platform that connects readers with their favorite books. Built with React 19 and modern web technologies, it offers a smooth, responsive experience across all devices. The platform features role-based access control with dedicated dashboards for users, librarians, and administrators.

## ✨ Key Features

### User Features

- 🔐 **Secure Authentication** - Email/password and Google OAuth integration
- 📚 **Browse & Search Books** - Extensive catalog with real-time search
- 🔍 **Advanced Filtering** - Filter by category, author, price range, and status
- 📊 **Smart Sorting** - Sort by newest, price (low-high/high-low), and name
- 🛒 **Easy Ordering** - Streamlined order placement with form validation
- 📦 **Order Tracking** - Real-time order status updates
- 💳 **Payment System** - Integrated mock payment processing
- ⭐ **Reviews & Ratings** - Submit and view book reviews with star ratings
- 👤 **User Dashboard** - Manage orders, profile, and view invoices
- 🎨 **Theme Toggle** - Switch between light and dark modes
- 💾 **Wishlist** - Save favorite books for later

### Librarian Features

- ➕ **Add New Books** - Comprehensive book entry form
- ✏️ **Edit Books** - Update book information and images
- 📋 **Manage Orders** - View and update order statuses
- 📈 **Latest Books Section** - Showcase new arrivals

### Admin Features

- 👥 **User Management** - View all users and manage roles
- 📚 **Book Management** - Toggle book status and delete books
- 🔒 **Role-Based Access** - Assign user, librarian, and admin roles
- 📊 **Complete Overview** - Monitor all system activities

### Technical Features

- 🎯 **Protected Routes** - Role-based route protection
- 🚀 **Performance Optimized** - Lazy loading and code splitting
- ♿ **Accessibility** - WCAG AA compliant with ARIA labels
- 📱 **Fully Responsive** - Mobile-first design approach
- 🎭 **Loading States** - Skeleton loaders for better UX
- 🔔 **Toast Notifications** - Real-time feedback on actions
- 🎨 **Smooth Animations** - Polished transitions and effects
- 🔄 **Error Handling** - Comprehensive error boundaries
- 🎯 **SEO Optimized** - Meta tags and semantic HTML
- 💨 **Fast Refresh** - Instant development feedback

## 🛠️ Technologies Used

### Frontend Framework & Libraries

- **React 19.2.0** - Modern UI library
- **Vite 7.2.4** - Next-generation build tool
- **React Router DOM 7.10.1** - Client-side routing

### Styling & UI

- **TailwindCSS 4.1.17** - Utility-first CSS framework
- **DaisyUI 5.5.8** - Tailwind CSS component library
- **Lucide React 0.556.0** - Beautiful icon set

### Form & Validation

- **React Hook Form 7.68.0** - Performant form management
- **Custom Validators** - Email, phone, and password validation

### Authentication & HTTP

- **Firebase 12.6.0** - Authentication and user management
- **Axios** - HTTP client with interceptors

### State Management & Utilities

- **React Context API** - Global state management
- **Custom Hooks** - Reusable logic (useFetch, useDebounce)
- **React Hot Toast 2.6.0** - Elegant notifications

### Development Tools

- **ESLint 9.39.1** - Code linting
- **Vite Plugin React 5.1.1** - Fast Refresh support

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** version 18.0.0 or higher
- **npm** or **yarn** package manager
- **Firebase account** for authentication setup

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/md-abdullah-al-ahad/bookcourier-client.git
cd bookcourier-client
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_URL=https://bookcourier-server-two.vercel.app/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start the development server**

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
bookcourier-client/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable components
│   │   ├── home/         # Home page components
│   │   ├── modals/       # Modal components
│   │   ├── BookCard.jsx  # Book display card
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ReviewsSection.jsx
│   ├── config/           # Configuration files
│   │   ├── axios.config.js
│   │   └── firebase.config.js
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useDebounce.js
│   │   └── useFetch.js
│   ├── layouts/          # Layout components
│   │   ├── DashboardLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages/            # Page components
│   │   ├── Auth/         # Login, Register
│   │   ├── Books/        # AllBooks, BookDetails
│   │   ├── Dashboard/    # User, Librarian, Admin dashboards
│   │   ├── Payment/      # PaymentPage
│   │   ├── HomePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── utils/            # Utility functions
│   │   ├── api.js        # API helpers
│   │   ├── formatters.js # Data formatting
│   │   ├── helpers.js    # General helpers
│   │   ├── toast.js      # Toast notifications
│   │   └── validation.js # Form validators
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env.local            # Environment variables
├── .gitignore
├── API_ENDPOINTS.md      # API documentation
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🔑 User Roles & Access

### User (Default)

- Browse and search books
- Place orders
- Track order status
- Submit reviews
- Manage profile and wishlist

### Librarian

- All user permissions
- Add new books
- Edit existing books
- Manage orders

### Admin

- All librarian permissions
- Manage user roles
- Delete books
- Toggle book availability
- Full system access

## 📸 Screenshots

_[Add screenshots after deployment]_

- Home page with featured books
- Book catalog with filters
- Book details and reviews
- Order placement modal
- User dashboard
- Librarian book management
- Admin user management
- Mobile responsive views

## 🔐 Default Credentials

**Admin Account:**

```
Email: [Create admin user via Firebase Console]
Password: [Set secure password]
```

**Test User:**

```
Register a new account or use Google Sign-In
```

## 🌐 API Integration

The client communicates with the BookCourier Server API. See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete documentation.

**Server Repository:** [Add server repo link]

## ⚠️ Known Issues

- **Mock Payment System** - Currently uses simulated payment processing. Real payment gateway integration pending.
- **Image Upload** - Book images use URLs instead of file upload.

## 🚀 Future Enhancements

- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for orders
- [ ] Advanced search with autocomplete
- [ ] Book recommendations based on history
- [ ] Reading lists and collections
- [ ] Book availability notifications
- [ ] Multi-language support
- [ ] PDF invoice download
- [ ] Social sharing features
- [ ] Chat support integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Follow the conventional commits specification:

```
<type>: <description>

[optional body]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```bash
git commit -m "feat: Add user authentication with Firebase"
git commit -m "fix: Resolve private route redirect loop"
git commit -m "style: Improve dashboard mobile responsiveness"
git commit -m "refactor: Extract API calls to custom hooks"
git commit -m "docs: Add comprehensive README"
git commit -m "perf: Optimize image loading with lazy loading"
```

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Md. Abdullah Al Ahad**

- GitHub: [@md-abdullah-al-ahad](https://github.com/md-abdullah-al-ahad)
- Email: [Your email]

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [DaisyUI](https://daisyui.com/) - Component library
- [Firebase](https://firebase.google.com/) - Authentication
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

For support, email [your-email] or join our community chat.

---

<div align="center">
  <p>Made with ❤️ by Md. Abdullah Al Ahad</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
