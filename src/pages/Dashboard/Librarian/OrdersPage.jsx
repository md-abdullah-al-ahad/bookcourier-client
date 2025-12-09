import { useState } from "react";
import { Package, Calendar, User, Phone, MapPin } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import SkeletonTable from "../../../components/SkeletonTable";
import { formatDate } from "../../../utils/formatters";
import { showSuccess, showError } from "../../../utils/toast";
import { patch } from "../../../utils/api";

const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const {
    data: ordersData,
    loading,
    error,
    refetch,
  } = useFetch("/orders/librarian/orders");
  const orders = ordersData?.orders || [];

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.orderStatus?.toLowerCase() === statusFilter;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "badge-warning",
      processing: "badge-info",
      shipped: "badge-info",
      delivered: "badge-success",
      cancelled: "badge-error",
    };
    return statusColors[status?.toLowerCase()] || "badge-ghost";
  };

  // Get payment status badge class
  const getPaymentBadge = (status) => {
    const paymentColors = {
      paid: "badge-success",
      unpaid: "badge-warning",
      refunded: "badge-info",
    };
    return paymentColors[status?.toLowerCase()] || "badge-ghost";
  };

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await patch(`/orders/${orderId}/status`, { status: newStatus });
      showSuccess("Order status updated successfully");
      refetch();
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    try {
      setCancellingOrderId(orderId);
      await patch(`/orders/${orderId}/cancel`);
      showSuccess("Order cancelled successfully");
      refetch();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Orders for My Books</h1>
        <SkeletonTable />
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Orders for My Books</h1>
          <p className="text-base-content/70">Manage orders for your books</p>
        </div>
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="bg-base-300 p-6 rounded-full">
              <Package className="w-16 h-16 text-base-content/40" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-base-content/70">
            Orders for your books will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Orders for My Books</h1>
        <p className="text-base-content/70">Manage orders for your books</p>
      </div>

      {/* Filter Section */}
      <div className="mb-6">
        <div className="form-control max-w-xs">
          <label className="label">
            <span className="label-text font-semibold">Filter by Status</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-base-content/70">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Book Name</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                {/* Order ID */}
                <td>
                  <span className="text-sm font-mono">
                    {order._id?.slice(-8) || "N/A"}
                  </span>
                </td>

                {/* Book Name */}
                <td>
                  <div className="font-medium">
                    {order.book?.name || "Book"}
                  </div>
                  <div className="text-sm text-base-content/60">
                    {order.book?.author}
                  </div>
                </td>

                {/* Customer */}
                <td>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-base-content/60" />
                    <span>{order.userName}</span>
                  </div>
                </td>

                {/* Contact */}
                <td>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-base-content/60" />
                      <span>{order.phoneNumber}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-base-content/60 mt-0.5" />
                      <span className="line-clamp-2">{order.address}</span>
                    </div>
                  </div>
                </td>

                {/* Order Date */}
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-base-content/60" />
                    <span className="text-sm">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </td>

                {/* Status Dropdown */}
                <td>
                  <select
                    className={`select select-sm select-bordered ${
                      updatingOrderId === order._id ? "loading" : ""
                    }`}
                    value={order.orderStatus?.toLowerCase() || "pending"}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={
                      updatingOrderId === order._id ||
                      order.orderStatus?.toLowerCase() === "cancelled"
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>

                {/* Payment Status */}
                <td>
                  <span
                    className={`badge ${getPaymentBadge(order.paymentStatus)}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  {order.orderStatus?.toLowerCase() === "pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className={`btn btn-sm btn-error ${
                        cancellingOrderId === order._id ? "loading" : ""
                      }`}
                      disabled={cancellingOrderId === order._id}
                    >
                      {cancellingOrderId === order._id ? "" : "Cancel"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Order ID */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-base-content/60">
                  #{order._id?.slice(-8) || "N/A"}
                </span>
                <span
                  className={`badge ${getPaymentBadge(order.paymentStatus)}`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Book Info */}
              <h3 className="font-bold text-lg">
                {order.book?.name || "Book"}
              </h3>
              <p className="text-sm text-base-content/60 mb-3">
                {order.book?.author}
              </p>

              <div className="divider my-2"></div>

              {/* Customer Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-base-content/60" />
                  <span className="font-medium">{order.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-base-content/60" />
                  <span className="text-sm">{order.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-base-content/60 mt-0.5" />
                  <span className="text-sm">{order.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-base-content/60" />
                  <span className="text-sm">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Status Control */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Order Status</span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    updatingOrderId === order._id ? "loading" : ""
                  }`}
                  value={order.orderStatus?.toLowerCase() || "pending"}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  disabled={
                    updatingOrderId === order._id ||
                    order.orderStatus?.toLowerCase() === "cancelled"
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Actions */}
              {order.orderStatus?.toLowerCase() === "pending" && (
                <>
                  <div className="divider my-2"></div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className={`btn btn-sm btn-error btn-block ${
                        cancellingOrderId === order._id ? "loading" : ""
                      }`}
                      disabled={cancellingOrderId === order._id}
                    >
                      Cancel Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredOrders.length === 0 && orders.length > 0 && (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">No orders found</p>
          <p className="text-base-content/70">Try adjusting your filter</p>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
