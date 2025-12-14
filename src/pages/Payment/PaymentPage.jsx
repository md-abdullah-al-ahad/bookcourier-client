import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import PageLoader from "../../components/PageLoader";
import { post, patch } from "../../utils/api";
import { showSuccess, showError } from "../../utils/toast";
import { formatCurrency } from "../../utils/formatters";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch order details
  const { data: orderData, loading, error } = useFetch(`/orders/${orderId}`);
  const order = orderData?.order || orderData;

  // Format card number with spaces
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
      setCardNumber(formatted);
    }
  };

  // Format expiry date
  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      if (value.length >= 2) {
        setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiryDate(value);
      }
    }
  };

  // Handle CVV input
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();

    // Validation
    const cardNumberClean = cardNumber.replace(/\s/g, "");
    if (cardNumberClean.length !== 16) {
      showError("Please enter a valid 16-digit card number");
      return;
    }

    if (expiryDate.length !== 5) {
      showError("Please enter a valid expiry date (MM/YY)");
      return;
    }

    if (cvv.length !== 3) {
      showError("Please enter a valid 3-digit CVV");
      return;
    }

    try {
      setProcessing(true);

      // Generate mock payment ID
      const paymentId = `PAY-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      // Process payment
      await post("/payments", {
        orderId,
        paymentId,
        amount: order.totalPrice,
        paymentMethod: "card",
      });

      // Update order payment status
      await patch(`/orders/${orderId}/payment`, {
        paymentStatus: "paid",
      });

      // Show success modal
      setShowSuccessModal(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard/my-orders");
        showSuccess("Payment completed successfully!");
      }, 2000);
    } catch (error) {
      showError(
        error.response?.data?.message || "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Loading state
  if (loading) {
    return <PageLoader />;
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-base-content/70 mb-6">
            The order you're trying to pay for could not be found.
          </p>
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="btn btn-primary"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Complete Payment
          </h1>
          <p className="text-base-content/70">
            Secure payment for Order #{order._id?.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Test Payment Notice */}
        <div className="alert alert-info mb-6">
          <Lock className="w-5 h-5" />
          <span>
            <strong>Test Payment System:</strong> This is a demo. Use any
            16-digit card number.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Order Summary</h2>

              {/* Book Details */}
              <div className="flex gap-4 mb-4">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-lg">
                    <img
                      src={
                        order.book?.image || "https://via.placeholder.com/100"
                      }
                      alt={order.book?.name}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{order.book?.name}</h3>
                  <p className="text-sm text-base-content/60">
                    {order.book?.author}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatCurrency(order.book?.price)}
                  </p>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Customer Details */}
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold">Delivery Details</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-base-content/60">Name:</span>{" "}
                    <span className="font-medium">{order.customerName}</span>
                  </p>
                  <p>
                    <span className="text-base-content/60">Phone:</span>{" "}
                    <span className="font-medium">{order.customerPhone}</span>
                  </p>
                  <p>
                    <span className="text-base-content/60">Address:</span>{" "}
                    <span className="font-medium">{order.deliveryAddress}</span>
                  </p>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Total Amount */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Payment Details
              </h2>

              <form onSubmit={handlePayment}>
                {/* Card Number */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Card Number
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="input input-bordered"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    disabled={processing}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Expiry Date */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Expiry Date
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="input input-bordered"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      disabled={processing}
                      required
                    />
                  </div>

                  {/* CVV */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">CVV</span>
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="input input-bordered"
                      value={cvv}
                      onChange={handleCvvChange}
                      disabled={processing}
                      required
                    />
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg btn-block ${
                    processing ? "loading" : ""
                  }`}
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : `Pay ${formatCurrency(order.totalPrice)}`}
                </button>
              </form>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-base-content/60">
                <Lock className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal modal-open">
          <div className="modal-box text-center animate-scale-in">
            <div className="flex justify-center mb-4">
              <div className="bg-success/10 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-success" />
              </div>
            </div>
            <h3 className="font-bold text-2xl mb-2">Payment Successful!</h3>
            <p className="text-base-content/70 mb-4">
              Your payment has been processed successfully.
            </p>
            <p className="text-sm text-base-content/60">
              Redirecting to your orders...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
