import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import RoleBasedRoute from "../components/RoleBasedRoute";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import HomePage from "../pages/Home/HomePage";
import AllBooksPage from "../pages/Books/AllBooksPage";
import BookDetailsPage from "../pages/Books/BookDetailsPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

// User Dashboard Pages
import MyOrdersPage from "../pages/Dashboard/User/MyOrdersPage";
import MyProfilePage from "../pages/Dashboard/User/MyProfilePage";
import InvoicesPage from "../pages/Dashboard/User/InvoicesPage";
import WishlistPage from "../pages/Dashboard/User/WishlistPage";

// Librarian Pages
import AddBookPage from "../pages/Dashboard/Librarian/AddBookPage";
import MyBooksPage from "../pages/Dashboard/Librarian/MyBooksPage";
import LibrarianOrdersPage from "../pages/Dashboard/Librarian/LibrarianOrdersPage";

// Admin Pages
import AllUsersPage from "../pages/Dashboard/Admin/AllUsersPage";
import ManageBooksPage from "../pages/Dashboard/Admin/ManageBooksPage";

// Error Page
import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "books",
        element: <AllBooksPage />,
      },
      {
        path: "books/:id",
        element: <BookDetailsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <MyProfilePage />,
      },
      {
        path: "my-orders",
        element: <MyOrdersPage />,
      },
      {
        path: "my-profile",
        element: <MyProfilePage />,
      },
      {
        path: "invoices",
        element: <InvoicesPage />,
      },
      {
        path: "my-wishlist",
        element: <WishlistPage />,
      },
    ],
  },
  {
    path: "/librarian",
    element: (
      <RoleBasedRoute allowedRoles={["librarian", "admin"]}>
        <DashboardLayout />
      </RoleBasedRoute>
    ),
    children: [
      {
        path: "add-book",
        element: <AddBookPage />,
      },
      {
        path: "my-books",
        element: <MyBooksPage />,
      },
      {
        path: "orders",
        element: <LibrarianOrdersPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <RoleBasedRoute allowedRoles={["admin"]}>
        <DashboardLayout />
      </RoleBasedRoute>
    ),
    children: [
      {
        path: "users",
        element: <AllUsersPage />,
      },
      {
        path: "manage-books",
        element: <ManageBooksPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
