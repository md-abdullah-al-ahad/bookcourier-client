import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../utils/toast";
import { validateEmail } from "../../utils/validation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Handle email/password login
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      showSuccess("Login successful! Welcome back.");
      navigate(from, { replace: true });
    } catch (error) {
      showError(
        error.message || "Failed to login. Please check your credentials."
      );
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      showSuccess("Login successful! Welcome back.");
      navigate(from, { replace: true });
    } catch (error) {
      showError(error.message || "Failed to login with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300/50">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content p-4 rounded-2xl shadow-lg">
                  <BookOpen className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-base-content/60 text-lg">
                Login to your BookCourier account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`input input-bordered w-full transition-all ${
                    errors.email ? "input-error" : "focus:input-primary"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    validate: (value) =>
                      validateEmail(value) ||
                      "Please enter a valid email address",
                  })}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error font-medium">
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`input input-bordered w-full pr-12 transition-all ${
                      errors.password ? "input-error" : "focus:input-primary"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error font-medium">
                      {errors.password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-focus font-medium hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className={`btn btn-primary btn-block btn-lg text-base shadow-lg hover:shadow-xl transition-all ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting || isGoogleLoading}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-base-content/50 my-6">OR</div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`btn btn-outline btn-block btn-lg gap-3 hover:bg-base-200 transition-all ${
                isGoogleLoading ? "loading" : ""
              }`}
              disabled={isSubmitting || isGoogleLoading}
            >
              {!isGoogleLoading && (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="text-base">
                {isGoogleLoading ? "Logging in..." : "Login with Google"}
              </span>
            </button>

            {/* Register Link */}
            <div className="text-center mt-8 pt-6 border-t border-base-300">
              <p className="text-base-content/70">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:text-primary-focus hover:underline transition-colors"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
