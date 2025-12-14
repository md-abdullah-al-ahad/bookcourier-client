import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import { validatePhone } from "../../utils/validation";
import { showSuccess, showError } from "../../utils/toast";
import { post } from "../../utils/api";

const OrderModal = ({ isOpen, onClose, book }) => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      userName: user?.displayName || user?.name || "",
      userEmail: user?.email || "",
      phoneNumber: "",
      address: "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        userName: user?.displayName || user?.name || "",
        userEmail: user?.email || "",
        phoneNumber: "",
        address: "",
      });
    }
  }, [user, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const orderData = {
        bookId: book._id || book.id,
        userName: data.userName,
        userEmail: data.userEmail,
        phoneNumber: data.phoneNumber,
        address: data.address,
      };

      await post("/orders", orderData);
      showSuccess("Order placed successfully! We will contact you soon.");
      reset();
      onClose();
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  // Handle modal close
  const handleClose = () => {
    reset();
    onClose();
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        reset();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, reset]);

  if (!isOpen || !book) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal modal-open"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        {/* Modal Box */}
        <div
          className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 id="order-modal-title" className="font-bold text-2xl mb-1">
                Place Order
              </h3>
              <p className="text-base-content/70">for {book.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="btn btn-sm btn-circle btn-ghost"
              type="button"
              aria-label="Close order modal"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input (Readonly) */}
            <div className="form-control">
              <label htmlFor="order-userName" className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <input
                id="order-userName"
                type="text"
                className="input input-bordered bg-base-200"
                {...register("userName")}
                readOnly
                aria-readonly="true"
              />
            </div>

            {/* Email Input (Readonly) */}
            <div className="form-control">
              <label htmlFor="order-userEmail" className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <input
                id="order-userEmail"
                type="email"
                className="input input-bordered bg-base-200"
                {...register("userEmail")}
                readOnly
                aria-readonly="true"
              />
            </div>

            {/* Phone Number Input */}
            <div className="form-control">
              <label htmlFor="order-phoneNumber" className="label">
                <span className="label-text font-medium">
                  Phone Number <span className="text-error">*</span>
                </span>
              </label>
              <input
                id="order-phoneNumber"
                type="tel"
                placeholder="01XXXXXXXXX"
                className={`input input-bordered ${
                  errors.phoneNumber ? "input-error" : ""
                }`}
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  validate: (value) =>
                    validatePhone(value) ||
                    "Please enter a valid Bangladesh phone number",
                })}
                aria-invalid={errors.phoneNumber ? "true" : "false"}
                aria-describedby={
                  errors.phoneNumber ? "phone-error" : undefined
                }
              />
              {errors.phoneNumber && (
                <label className="label">
                  <span
                    id="phone-error"
                    className="label-text-alt text-error"
                    role="alert"
                  >
                    {errors.phoneNumber.message}
                  </span>
                </label>
              )}
            </div>

            {/* Address Textarea */}
            <div className="form-control">
              <label htmlFor="order-address" className="label">
                <span className="label-text font-medium">
                  Delivery Address <span className="text-error">*</span>
                </span>
              </label>
              <textarea
                id="order-address"
                placeholder="Enter your full delivery address with city and postal code"
                className={`textarea textarea-bordered h-24 ${
                  errors.address ? "textarea-error" : ""
                }`}
                {...register("address", {
                  required: "Address is required",
                  minLength: {
                    value: 10,
                    message: "Address must be at least 10 characters long",
                  },
                })}
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby={errors.address ? "address-error" : undefined}
              />
              {errors.address && (
                <label className="label">
                  <span
                    id="address-error"
                    className="label-text-alt text-error"
                    role="alert"
                  >
                    {errors.address.message}
                  </span>
                </label>
              )}
            </div>

            <div className="divider"></div>

            {/* Order Summary Card */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-lg mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Book:</span>
                    <span className="font-medium">{book.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Price:</span>
                    <span className="font-medium">
                      {formatCurrency(book.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Delivery:</span>
                    <span className="font-medium text-success">Free</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">
                      {formatCurrency(book.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost"
                disabled={isSubmitting}
                aria-label="Cancel order"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
                aria-label={
                  isSubmitting ? "Placing order, please wait" : "Submit order"
                }
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrderModal;
