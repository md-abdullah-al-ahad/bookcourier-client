import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import router from "./routes/Routes";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            // Default options
            duration: 3000,
            style: {
              background: "var(--fallback-b1, oklch(var(--b1)))",
              color: "var(--fallback-bc, oklch(var(--bc)))",
              padding: "16px",
              borderRadius: "8px",
              fontWeight: "500",
            },
            // Success toast
            success: {
              duration: 3000,
              iconTheme: {
                primary: "var(--fallback-su, oklch(var(--su)))",
                secondary: "white",
              },
            },
            // Error toast
            error: {
              duration: 4000,
              iconTheme: {
                primary: "var(--fallback-er, oklch(var(--er)))",
                secondary: "white",
              },
            },
            // Loading toast
            loading: {
              iconTheme: {
                primary: "var(--fallback-p, oklch(var(--p)))",
                secondary: "white",
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
