import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { showSuccess } from "../utils/toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Navigation links
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active font-semibold" : "transition-colors duration-200"
          }
          onClick={closeMobileMenu}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? "active font-semibold" : "transition-colors duration-200"
          }
          onClick={closeMobileMenu}
        >
          All Books
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard/my-orders"
            className={({ isActive }) =>
              isActive
                ? "active font-semibold"
                : "transition-colors duration-200"
            }
            onClick={closeMobileMenu}
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav
      className={`navbar bg-base-100 sticky top-0 z-50 transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
      aria-label="Main navigation"
    >
      {/* Mobile Menu Drawer */}
      <div className="drawer drawer-end lg:hidden">
        <input
          id="mobile-menu-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isMobileMenuOpen}
          onChange={(e) => setIsMobileMenuOpen(e.target.checked)}
        />

        <div className="drawer-content flex items-center justify-between w-full">
          {/* Navbar Start - Logo */}
          <div className="navbar-start">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="hidden sm:inline">BookCourier</span>
            </Link>
          </div>

          {/* Navbar End - Actions */}
          <div className="navbar-end flex items-center gap-2">
            {/* Theme Toggle */}
            <label
              className="swap swap-rotate btn btn-ghost btn-circle transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              <input
                type="checkbox"
                onChange={toggleTheme}
                checked={theme === "dark"}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              />
              <Sun className="swap-on w-5 h-5 transition-transform" />
              <Moon className="swap-off w-5 h-5 transition-transform" />
            </label>

            {/* User Section or Auth Buttons */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar"
                  aria-label="User menu"
                >
                  <div className="w-10 rounded-full">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/150"}
                      alt={`${user.displayName || "User"}'s profile picture`}
                      loading="lazy"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow-lg bg-base-200 rounded-box w-52"
                >
                  <li className="menu-title">
                    <span>{user.displayName || "User"}</span>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/my-orders"
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/my-profile"
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-error"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="hidden lg:flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm transition-all duration-300 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <label
              htmlFor="mobile-menu-drawer"
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </label>
          </div>
        </div>

        {/* Mobile Drawer Sidebar */}
        <div className="drawer-side">
          <label
            htmlFor="mobile-menu-drawer"
            className="drawer-overlay"
          ></label>
          <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-bold"
                onClick={closeMobileMenu}
              >
                <BookOpen className="w-6 h-6 text-primary" />
                BookCourier
              </Link>
              <button
                onClick={closeMobileMenu}
                className="btn btn-ghost btn-circle btn-sm"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <ul className="menu-compact">{navLinks}</ul>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/login"
                  className="btn btn-ghost"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex w-full">
        {/* Navbar Start - Logo */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="w-6 h-6 text-primary" />
            BookCourier
          </Link>
        </div>

        {/* Navbar Center - Navigation Links */}
        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1">{navLinks}</ul>
        </div>

        {/* Navbar End - Theme Toggle and User */}
        <div className="navbar-end flex items-center gap-2">
          {/* Theme Toggle */}
          <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <Sun className="swap-on w-5 h-5" />
            <Moon className="swap-off w-5 h-5" />
          </label>

          {/* User Section or Auth Buttons */}
          {user ? (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar"
                aria-label="User menu"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/150"}
                    alt={`${user.displayName || "User"}'s profile picture`}
                    loading="lazy"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow-lg bg-base-200 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>{user.displayName || "User"}</span>
                </li>
                <li>
                  <Link
                    to="/dashboard/my-orders"
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/my-profile"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
