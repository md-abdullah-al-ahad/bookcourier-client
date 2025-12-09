import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Camera,
  Lock,
  ShoppingBag,
  BookOpen,
  Heart,
  Activity,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../utils/formatters";
import { showSuccess, showError } from "../../../utils/toast";
import { put, get } from "../../../utils/api";
import useFetch from "../../../hooks/useFetch";

const MyProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user statistics
  const { data: statsData, loading: statsLoading } = useFetch("/users/stats");
  const stats = statsData || {};

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.displayName || user?.name || "",
      photoURL: user?.photoURL || "",
    },
  });

  const photoURL = watch("photoURL");

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setValue("name", user?.displayName || user?.name || "");
      setValue("photoURL", user?.photoURL || "");
      setImagePreview(user?.photoURL || null);
    }
  }, [user, setValue]);

  // Update image preview when photoURL changes
  useEffect(() => {
    if (photoURL) {
      setImagePreview(photoURL);
    }
  }, [photoURL]);

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
      setIsEditing(false);
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
    setImagePreview(user?.photoURL || null);
    setIsEditing(false);
  };

  // Get member since date
  const memberSince =
    user?.metadata?.creationTime || user?.createdAt || new Date();

  // Get default avatar
  const getDefaultAvatar = () => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-base-content/70">
          Manage your account information and preferences
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Orders */}
        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg transition-all duration-300">
          <div className="card-body p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-base-content/60 mb-2 font-medium">
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold text-primary">
                  {statsLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    stats.totalOrders || 0
                  )}
                </h3>
              </div>
              <div className="bg-primary/20 p-3 rounded-lg flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Books Ordered */}
        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:shadow-lg transition-all duration-300">
          <div className="card-body p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-base-content/60 mb-2 font-medium">
                  Books Ordered
                </p>
                <h3 className="text-2xl font-bold text-secondary">
                  {statsLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    stats.totalBooks || 0
                  )}
                </h3>
              </div>
              <div className="bg-secondary/20 p-3 rounded-lg flex-shrink-0">
                <BookOpen className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="card bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:shadow-lg transition-all duration-300">
          <div className="card-body p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-base-content/60 mb-2 font-medium">
                  Wishlist
                </p>
                <h3 className="text-2xl font-bold text-accent">
                  {statsLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    stats.wishlistItems || 0
                  )}
                </h3>
              </div>
              <div className="bg-accent/20 p-3 rounded-lg flex-shrink-0">
                <Heart className="w-5 h-5 text-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:shadow-lg transition-all duration-300">
          <div className="card-body p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-base-content/60 mb-2 font-medium">
                  Status
                </p>
                <h3 className="text-2xl font-bold text-success">Active</h3>
              </div>
              <div className="bg-success/20 p-3 rounded-lg flex-shrink-0">
                <Activity className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Display */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div className="card-body items-center text-center">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="avatar">
                  <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 group-hover:ring-offset-8 transition-all duration-300">
                    <img
                      src={imagePreview || getDefaultAvatar()}
                      alt={user?.displayName || user?.name}
                      onError={(e) => {
                        e.target.src = getDefaultAvatar();
                      }}
                    />
                  </div>
                </div>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              {/* User Name */}
              <h2 className="text-2xl font-bold mt-4">
                {user?.displayName || user?.name || "User"}
              </h2>

              {/* Email */}
              <div className="w-full px-4">
                <p className="text-base-content/70 flex items-center justify-center gap-2 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </p>
              </div>

              {/* Role Badge */}
              <div className="mt-4">
                <span className="badge badge-primary badge-lg gap-2 px-4 py-3 capitalize">
                  <Shield className="w-4 h-4" />
                  {user?.role || "User"}
                </span>
              </div>

              <div className="divider"></div>

              {/* Account Info */}
              <div className="w-full space-y-3 px-2">
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-base-content/70">
                      Member Since
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-right">
                    {formatDate(memberSince)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-base-content/70">
                      Account Type
                    </span>
                  </div>
                  <span className="text-sm font-semibold capitalize text-right">
                    {user?.role || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Profile */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title text-2xl">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-sm btn-primary gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <User className="w-4 h-4 flex-shrink-0" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className={`input input-bordered w-full ${
                      errors.name ? "input-error" : ""
                    } ${!isEditing ? "input-disabled" : ""}`}
                    disabled={!isEditing}
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must not exceed 50 characters",
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
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Camera className="w-4 h-4 flex-shrink-0" />
                      Photo URL
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className={`input input-bordered w-full ${
                      errors.photoURL ? "input-error" : ""
                    } ${!isEditing ? "input-disabled" : ""}`}
                    disabled={!isEditing}
                    {...register("photoURL", {
                      pattern: {
                        value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                        message:
                          "Please enter a valid image URL (jpg, png, gif, webp)",
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
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      Email Address
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ""}
                      className="input input-bordered bg-base-200 cursor-not-allowed w-full pr-3"
                      disabled
                      readOnly
                      title={user?.email || ""}
                    />
                  </div>
                  <label className="label pt-1 pb-0">
                    <span className="label-text-alt text-base-content/60 flex items-center gap-2 pl-0">
                      <Lock className="w-3 h-3 flex-shrink-0" />
                      <span>Email cannot be changed</span>
                    </span>
                  </label>
                </div>

                {/* Role Field (Read Only) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      Account Role
                    </span>
                  </label>
                  <div className="px-4 py-3 bg-base-200 rounded-lg">
                    <p className="text-base font-medium capitalize mb-2">
                      {user?.role || "user"}
                    </p>
                    <p className="text-sm text-base-content/60 flex items-center gap-2">
                      <Lock className="w-3 h-3 flex-shrink-0" />
                      <span>Contact admin to change your role</span>
                    </p>
                  </div>
                </div>

                {/* Button Group */}
                {isEditing && (
                  <div className="flex gap-3 justify-end pt-4 border-t border-base-300">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-ghost gap-2"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
