import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  FileText,
  Heart,
  PlusCircle,
  BookOpen,
  Package,
  Users,
  Library,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showSuccess } from "../utils/toast";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    const role = user?.role?.toLowerCase();

    if (role === "admin") {
      return [
        { path: "/dashboard/users", icon: Users, label: "All Users" },
        {
          path: "/dashboard/manage-books",
          icon: Library,
          label: "Manage Books",
        },
        {
          path: "/dashboard/all-orders",
          icon: ShoppingCart,
          label: "All Orders",
        },
        { path: "/dashboard/profile", icon: User, label: "My Profile" },
      ];
    }

    if (role === "librarian") {
      return [
        { path: "/dashboard/add-book", icon: PlusCircle, label: "Add Book" },
        { path: "/dashboard/my-books", icon: BookOpen, label: "My Books" },
        { path: "/dashboard/orders", icon: Package, label: "Orders" },
        { path: "/dashboard/profile", icon: User, label: "My Profile" },
      ];
    }

    // Default user role
    return [
      { path: "/dashboard/my-orders", icon: ShoppingBag, label: "My Orders" },
      { path: "/dashboard/profile", icon: User, label: "My Profile" },
      { path: "/dashboard/invoices", icon: FileText, label: "Invoices" },
      { path: "/dashboard/wishlist", icon: Heart, label: "My Wishlist" },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content (Main Area) */}
      <div className="drawer-content flex flex-col bg-base-200">
        {/* Top Bar for Mobile */}
        <div className="navbar bg-base-100 shadow-md lg:hidden sticky top-0 z-10">
          <div className="flex-none">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost drawer-button"
            >
              <Menu className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="flex-none">
            {/* User Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={
                      user?.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt={user?.displayName || user?.name}
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </div>

      {/* Drawer Side (Sidebar) */}
      <div className="drawer-side z-20">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col">
          {/* Logo & Dashboard Heading */}
          <div className="mb-8 px-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-primary to-secondary text-primary-content p-2 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-xs text-base-content/60 capitalize">
                  {user?.role || "User"} Panel
                </p>
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="mb-6 px-4 py-4 bg-base-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      user?.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt={user?.displayName || user?.name}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {user?.displayName || user?.name}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="menu-compact flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-primary-content font-semibold"
                          : "hover:bg-base-200"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="divider"></div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error gap-2 mt-auto"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-base-content/50">
            © 2025 BookCourier
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
