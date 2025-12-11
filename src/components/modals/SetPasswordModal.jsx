import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { updatePassword } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { post } from "../../utils/api";
import { showSuccess, showError } from "../../utils/toast";

/**
 * Mandatory Password Creation Modal for Google Sign-in Users
 * This modal cannot be closed until a password is set
 */
const SetPasswordModal = ({ onPasswordSet }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // Password validation rules
  const passwordRules = {
    minLength: password?.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Get current Firebase user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user is currently logged in");
      }

      // Update password in Firebase
      await updatePassword(currentUser, data.password);

      // Notify backend that password is set
      await post("/users/password-set");

      showSuccess("Password created successfully!");

      // Call the callback to proceed to the app
      if (onPasswordSet) {
        onPasswordSet();
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error setting password:", error);
      }

      // Handle specific Firebase errors
      let errorMessage = "Failed to create password";
      if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please sign out and sign in again to set a password";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use a stronger password";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-warning/20 p-4 rounded-full">
              <Lock className="w-8 h-8 text-warning" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2">Create Your Password</h3>
          <p className="text-base-content/70">
            For security purposes, you need to create a password for your
            account.
          </p>
        </div>

        {/* Alert */}
        <div className="alert alert-warning mb-6">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">
            This is a one-time requirement. You'll be able to sign in with
            Google or this password in the future.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">New Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`input input-bordered w-full pr-10 ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: () =>
                    isPasswordValid || "Password does not meet requirements",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                onClick={() => setShowPassword(!showPassword)}
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
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              </label>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Confirm Password</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`input input-bordered w-full pr-10 ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.confirmPassword.message}
                </span>
              </label>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-base-200 p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold mb-2">Password Requirements:</p>
            <div className="space-y-1">
              <PasswordRequirement
                met={passwordRules.minLength}
                text="At least 8 characters"
              />
              <PasswordRequirement
                met={passwordRules.hasUpperCase}
                text="One uppercase letter"
              />
              <PasswordRequirement
                met={passwordRules.hasLowerCase}
                text="One lowercase letter"
              />
              <PasswordRequirement
                met={passwordRules.hasNumber}
                text="One number"
              />
              <PasswordRequirement
                met={passwordRules.hasSpecialChar}
                text="One special character (!@#$%^&*)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${
              isSubmitting ? "loading" : ""
            }`}
            disabled={isSubmitting || !isPasswordValid}
          >
            {isSubmitting ? "" : "Create Password & Continue"}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-base-content/60">
            Your password will be securely encrypted and stored.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Password Requirement Component
 */
const PasswordRequirement = ({ met, text }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle className="w-4 h-4 text-success shrink-0" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-base-content/30 shrink-0" />
      )}
      <span className={met ? "text-success" : "text-base-content/60"}>
        {text}
      </span>
    </div>
  );
};

export default SetPasswordModal;
