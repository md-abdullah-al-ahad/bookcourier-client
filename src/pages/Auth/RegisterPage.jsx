import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, BookOpen, Check, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../utils/toast";
import { validateEmail, getPasswordStrength } from "../../utils/validation";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password", "");

  // Update password strength in real-time
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPasswordStrength(getPasswordStrength(pwd));
  };

  // Password requirements validation
  const getPasswordRequirements = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    };
  };

  const requirements = getPasswordRequirements(password);
  const allRequirementsMet = Object.values(requirements).every(Boolean);

  // Get progress color based on strength
  const getStrengthColor = () => {
    if (passwordStrength === "weak") return "progress-error";
    if (passwordStrength === "medium") return "progress-warning";
    return "progress-success";
  };

  // Get progress value
  const getStrengthValue = () => {
    if (passwordStrength === "weak") return 33;
    if (passwordStrength === "medium") return 66;
    return 100;
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await registerUser(
        data.email,
        data.password,
        data.name,
        data.photoURL || null
      );
      showSuccess("Registration successful! Welcome to BookCourier.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showError(error.message || "Failed to register. Please try again.");
    }
  };

  // Handle Google registration
  const handleGoogleRegister = async () => {
    try {
      setIsGoogleLoading(true);
      await loginWithGoogle();
      showSuccess("Registration successful! Welcome to BookCourier.");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showError(
        error.message || "Failed to register with Google. Please try again."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-secondary/5 via-base-200 to-accent/5 py-12 px-4 animate-fade-in">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300/50">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="bg-linear-to-br from-secondary to-accent text-primary-content p-4 rounded-2xl shadow-lg">
                  <BookOpen className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-3 bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                Join BookCourier
              </h1>
              <p className="text-base-content/60 text-lg">
                Create your account
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div className="form-control">
                <label htmlFor="register-name" className="label">
                  <span className="label-text font-semibold text-base">
                    Full Name
                  </span>
                </label>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  className={`input input-bordered w-full transition-all ${
                    errors.name ? "input-error" : "focus:input-primary"
                  }`}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <label className="label">
                    <span
                      id="name-error"
                      className="label-text-alt text-error font-medium"
                      role="alert"
                    >
                      {errors.name.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label htmlFor="register-email" className="label">
                  <span className="label-text font-semibold text-base">
                    Email Address
                  </span>
                </label>
                <input
                  id="register-email"
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
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <label className="label">
                    <span
                      id="email-error"
                      className="label-text-alt text-error font-medium"
                      role="alert"
                    >
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label htmlFor="register-password" className="label">
                  <span className="label-text font-semibold text-base">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`input input-bordered w-full pr-12 transition-all ${
                      errors.password ? "input-error" : "focus:input-primary"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      validate: () =>
                        allRequirementsMet ||
                        "Password does not meet all requirements",
                    })}
                    onChange={handlePasswordChange}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby="password-requirements"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-primary transition-colors"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-base-content/60">
                        Password strength:
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          passwordStrength === "weak"
                            ? "text-error"
                            : passwordStrength === "medium"
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {passwordStrength.toUpperCase()}
                      </span>
                    </div>
                    <progress
                      className={`progress w-full ${getStrengthColor()}`}
                      value={getStrengthValue()}
                      max="100"
                    ></progress>
                  </div>
                )}

                {/* Password Requirements */}
                <div id="password-requirements" className="mt-3 space-y-1">
                  <p className="text-xs font-semibold text-base-content/70 mb-2">
                    Password must contain:
                  </p>
                  {[
                    { key: "minLength", text: "Minimum 8 characters" },
                    { key: "uppercase", text: "At least one uppercase letter" },
                    { key: "lowercase", text: "At least one lowercase letter" },
                    { key: "number", text: "At least one number" },
                    { key: "special", text: "At least one special character" },
                  ].map(({ key, text }) => (
                    <div key={key} className="flex items-center gap-2">
                      {requirements[key] ? (
                        <Check
                          className="w-4 h-4 text-success"
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          className="w-4 h-4 text-base-content/30"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className={`text-xs ${
                          requirements[key]
                            ? "text-success"
                            : "text-base-content/60"
                        }`}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error font-medium">
                      {errors.password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Photo URL Field */}
              <div className="form-control">
                <label htmlFor="register-photoURL" className="label">
                  <span className="label-text font-semibold text-base">
                    Photo URL (Optional)
                  </span>
                </label>
                <input
                  id="register-photoURL"
                  type="url"
                  placeholder="Enter your profile photo URL"
                  className={`input input-bordered w-full transition-all ${
                    errors.photoURL ? "input-error" : "focus:input-primary"
                  }`}
                  {...register("photoURL", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  })}
                  aria-invalid={errors.photoURL ? "true" : "false"}
                  aria-describedby={
                    errors.photoURL ? "photoURL-error" : undefined
                  }
                />
                {errors.photoURL && (
                  <label className="label">
                    <span
                      id="photoURL-error"
                      className="label-text-alt text-error font-medium"
                      role="alert"
                    >
                      {errors.photoURL.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className={`btn btn-primary btn-block btn-lg text-base shadow-lg hover:shadow-xl transition-all ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting || isGoogleLoading}
                aria-label={
                  isSubmitting
                    ? "Creating account, please wait"
                    : "Create your account"
                }
              >
                {isSubmitting ? "Creating Account..." : "Register"}
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-base-content/50 my-6">OR</div>

            {/* Google Registration Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className={`btn btn-outline btn-block btn-lg gap-3 hover:bg-base-200 transition-all ${
                isGoogleLoading ? "loading" : ""
              }`}
              disabled={isSubmitting || isGoogleLoading}
              aria-label={
                isGoogleLoading
                  ? "Registering with Google, please wait"
                  : "Register with Google"
              }
            >
              {!isGoogleLoading && (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isGoogleLoading ? "Registering..." : "Register with Google"}
            </button>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-base-300">
              <p className="text-base-content/70">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:text-primary-focus hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
