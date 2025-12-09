import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, CreditCard, Package } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import SkeletonTable from '../../../components/SkeletonTable';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { showSuccess, showError } from '../../../utils/toast';
import { patch } from '../../../utils/api';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { data: ordersData, loading, error, refetch } = useFetch('/orders/my-orders');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const orders = ordersData?.orders || [];

  // Get status badge class
  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-info',
      delivered: 'badge-success',
      cancelled: 'badge-error',
    };
    return statusColors[status?.toLowerCase()] || 'badge-ghost';
  };

  // Get payment status badge class
  const getPaymentBadge = (status) => {
    const paymentColors = {
      paid: 'badge-success',
      unpaid: 'badge-warning',
      refunded: 'badge-info',
    };
    return paymentColors[status?.toLowerCase()] || 'badge-ghost';
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    try {
      setCancellingOrderId(orderId);
      await patch(`/orders/${orderId}/cancel`);
      showSuccess('Order cancelled successfully');
      refetch();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Handle pay now
  const handlePayNow = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <SkeletonTable />
      </div>
    );
  }

  // Empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="bg-base-300 p-6 rounded-full">
            <ShoppingBag className="w-16 h-16 text-base-content/40" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-base-content/70 mb-6">
          You haven't placed any orders. Start browsing our collection!
        </p>
        <Link to="/books" className="btn btn-primary">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-base-content/70">Track and manage your book orders</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Book</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                {/* Book */}
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={order.book?.image || 'https://via.placeholder.com/100'}
                          alt={order.book?.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{order.book?.name || 'Book'}</div>
                      <div className="text-sm text-base-content/60">
                        {order.book?.author || 'Unknown Author'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Order Date */}
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-base-content/60" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>

                {/* Payment Status */}
                <td>
                  <span className={`badge ${getPaymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>

                {/* Total Amount */}
                <td className="font-semibold">{formatCurrency(order.totalAmount)}</td>

                {/* Actions */}
                <td>
                  <div className="flex gap-2">
                    {order.orderStatus?.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className={`btn btn-sm btn-error ${
                          cancellingOrderId === order._id ? 'loading' : ''
                        }`}
                        disabled={cancellingOrderId === order._id}
                      >
                        {cancellingOrderId === order._id ? '' : 'Cancel'}
                      </button>
                    )}
                    {order.paymentStatus?.toLowerCase() === 'unpaid' &&
                      order.orderStatus?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handlePayNow(order._id)}
                          className="btn btn-sm btn-primary"
                        >
                          Pay Now
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Book Info */}
              <div className="flex items-start gap-3 mb-4">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-lg">
                    <img
                      src={order.book?.image || 'https://via.placeholder.com/100'}
                      alt={order.book?.name}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{order.book?.name || 'Book'}</h3>
                  <p className="text-sm text-base-content/60">{order.book?.author}</p>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Order Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Order Date
                  </span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Status
                  </span>
                  <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment
                  </span>
                  <span className={`badge ${getPaymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {(order.orderStatus?.toLowerCase() === 'pending' ||
                order.paymentStatus?.toLowerCase() === 'unpaid') && (
                <>
                  <div className="divider my-2"></div>
                  <div className="card-actions justify-end">
                    {order.orderStatus?.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className={`btn btn-sm btn-error ${
                          cancellingOrderId === order._id ? 'loading' : ''
                        }`}
                        disabled={cancellingOrderId === order._id}
                      >
                        Cancel Order
                      </button>
                    )}
                    {order.paymentStatus?.toLowerCase() === 'unpaid' &&
                      order.orderStatus?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handlePayNow(order._id)}
                          className="btn btn-sm btn-primary"
                        >
                          Pay Now
                        </button>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
