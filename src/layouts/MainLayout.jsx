import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar will go here */}
      <nav className="bg-base-200 p-4">
        <h1 className="text-2xl font-bold">BookCourier - Main Layout</h1>
      </nav>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer will go here */}
      <footer className="bg-base-200 p-4 text-center mt-8">
        <p>© 2025 BookCourier. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
