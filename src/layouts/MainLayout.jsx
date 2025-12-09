import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

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
