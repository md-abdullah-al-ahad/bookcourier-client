import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../utils/formatters";
import { showSuccess, showError } from "../../../utils/toast";
import { put } from "../../../utils/api";

const MyProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.displayName || user?.name || "",
      photoURL: user?.photoURL || "",
    },
  });

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setValue("name", user?.displayName || user?.name || "");
      setValue("photoURL", user?.photoURL || "");
    }
  }, [user, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Update Firebase profile
      await updateUserProfile(data.name, data.photoURL);

      // Update backend profile
      await put("/users/profile", {
        name: data.name,
        photoURL: data.photoURL,
      });

      showSuccess("Profile updated successfully!");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset({
      name: user?.displayName || user?.name || "",
      photoURL: user?.photoURL || "",
    });
  };

  // Get member since date
  const memberSince =
    user?.metadata?.creationTime || user?.createdAt || new Date();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-base-content/70">
          View and manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1 - Profile Display */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-6">Profile Information</h2>

            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                  <img
                    src={
                      user?.photoURL ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                    }
                    alt={user?.displayName || user?.name}
                  />
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-base-content/60 mb-1">Full Name</p>
                  <p className="text-xl font-bold">
                    {user?.displayName || user?.name || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-base-content/60 mb-1">
                    Email Address
                  </p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Role */}
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-base-content/60 mb-1">Role</p>
                  <span className="badge badge-primary badge-lg capitalize">
                    {user?.role || "User"}
                  </span>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Member Since */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-base-content/60 mb-1">
                    Member Since
                  </p>
                  <p className="font-medium">{formatDate(memberSince)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - Edit Profile */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-6">Update Profile</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={`input input-bordered w-full ${
                    errors.name ? "input-error" : ""
                  }`}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.name.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Photo URL Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Photo URL</span>
                </label>
                <input
                  type="url"
                  placeholder="Enter photo URL"
                  className={`input input-bordered w-full ${
                    errors.photoURL ? "input-error" : ""
                  }`}
                  {...register("photoURL", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  })}
                />
                {errors.photoURL && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.photoURL.message}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Leave empty to use default avatar
                  </span>
                </label>
              </div>

              {/* Email Field (Read Only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="input input-bordered bg-base-200"
                  disabled
                  readOnly
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    Email cannot be changed
                  </span>
                </label>
              </div>

              <div className="divider"></div>

              {/* Button Group */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-ghost"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
