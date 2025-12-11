import { useState } from "react";
import { Users, Search, Shield, UserCog } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import SkeletonTable from "../../../components/SkeletonTable";
import { showSuccess, showError } from "../../../utils/toast";
import { patch } from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const AllUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const { user: currentUser, refreshUser } = useAuth();

  const { data: usersData, loading, error, refetch } = useFetch("/users/all");
  const users = usersData?.users || [];

  // Filter users by search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Get role badge class
  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "badge-secondary",
      librarian: "badge-primary",
      user: "badge-ghost",
    };
    return roleColors[role?.toLowerCase()] || "badge-ghost";
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    const confirmed = window.confirm(
      `Are you sure you want to change this user's role to ${newRole}?`
    );
    if (!confirmed) return;

    try {
      setUpdatingUserId(userId);

      // Find the user being updated to check if it's the current user
      const userBeingUpdated = users.find((u) => u._id === userId);
      const isCurrentUser =
        currentUser?.mongoId === userId ||
        currentUser?.uid === userId ||
        currentUser?.email === userBeingUpdated?.email;

      // Debug logging
      if (import.meta.env.DEV) {
        console.log("=== Role Update Debug ===");
        console.log("Updating user ID:", userId);
        console.log("User being updated:", userBeingUpdated);
        console.log("Current user mongoId:", currentUser?.mongoId);
        console.log("Current user uid:", currentUser?.uid);
        console.log("Current user email:", currentUser?.email);
        console.log("Is current user?:", isCurrentUser);
        console.log("========================");
      }

      await patch(`/users/${userId}/role`, { role: newRole });
      showSuccess(`User role updated to ${newRole} successfully`);

      // Refetch the users list
      await refetch();

      // If updating current user's role, refresh auth context
      if (isCurrentUser) {
        console.log("Refreshing current user role...");
        await refreshUser();

        // Give a small delay for the state to update
        setTimeout(() => {
          console.log("User role after refresh:", currentUser?.role);
        }, 500);
      }
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update user role");
      console.error("Role update error:", error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <SkeletonTable />
      </div>
    );
  }

  // Empty state
  if (!users || users.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
          <p className="text-base-content/70">
            Manage user roles and permissions
          </p>
        </div>
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="bg-base-300 p-6 rounded-full">
              <Users className="w-16 h-16 text-base-content/40" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">No users found</h2>
          <p className="text-base-content/70">No users in the system yet</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-base-content/70">
          Manage user roles and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="stats shadow mb-6">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{users.length}</div>
          <div className="stat-desc">Registered in the system</div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <div className="form-control max-w-md">
          <label className="input input-bordered flex items-center gap-2">
            <Search className="w-5 h-5 opacity-70" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-base-content/70">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                {/* User (Avatar + Name) */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img
                          src={
                            user.photoURL ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                          }
                          alt={user.name}
                        />
                      </div>
                    </div>
                    <div className="font-semibold">{user.name}</div>
                  </div>
                </td>

                {/* Email */}
                <td>{user.email}</td>

                {/* Role */}
                <td>
                  <span
                    className={`badge ${getRoleBadge(user.role)} capitalize`}
                  >
                    {user.role || "User"}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRoleChange(user._id, "librarian")}
                      className={`btn btn-sm btn-primary ${
                        updatingUserId === user._id ? "loading" : ""
                      }`}
                      disabled={
                        user.role?.toLowerCase() === "librarian" ||
                        updatingUserId === user._id
                      }
                    >
                      {updatingUserId === user._id ? "" : "Make Librarian"}
                    </button>
                    <button
                      onClick={() => handleRoleChange(user._id, "admin")}
                      className={`btn btn-sm btn-secondary ${
                        updatingUserId === user._id ? "loading" : ""
                      }`}
                      disabled={
                        user.role?.toLowerCase() === "admin" ||
                        updatingUserId === user._id
                      }
                    >
                      {updatingUserId === user._id ? "" : "Make Admin"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        user.photoURL ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                      }
                      alt={user.name}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-sm text-base-content/60">{user.email}</p>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Role */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-base-content/70 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Current Role
                </span>
                <span
                  className={`badge ${getRoleBadge(
                    user.role
                  )} badge-lg capitalize`}
                >
                  {user.role || "User"}
                </span>
              </div>

              <div className="divider my-2"></div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => handleRoleChange(user._id, "librarian")}
                  className={`btn btn-sm btn-primary btn-block ${
                    updatingUserId === user._id ? "loading" : ""
                  }`}
                  disabled={
                    user.role?.toLowerCase() === "librarian" ||
                    updatingUserId === user._id
                  }
                >
                  {updatingUserId === user._id ? "" : "Make Librarian"}
                </button>
                <button
                  onClick={() => handleRoleChange(user._id, "admin")}
                  className={`btn btn-sm btn-secondary btn-block ${
                    updatingUserId === user._id ? "loading" : ""
                  }`}
                  disabled={
                    user.role?.toLowerCase() === "admin" ||
                    updatingUserId === user._id
                  }
                >
                  {updatingUserId === user._id ? "" : "Make Admin"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredUsers.length === 0 && users.length > 0 && (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">No users found</p>
          <p className="text-base-content/70">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;
