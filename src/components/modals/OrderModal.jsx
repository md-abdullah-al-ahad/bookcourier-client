import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { post } from "../../utils/api";
import { showError, showSuccess } from "../../utils/toast";
import { formatCurrency } from "../../utils/formatters";
import { validatePhone } from "../../utils/validation";

/**
 * Order placement modal shown from the book details page
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {function} props.onClose - Callback to close the modal
 * @param {object} props.book - Book being ordered
 */
const OrderModal = ({ isOpen, onClose, book }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      phoneNumber: "",
      address: "",
      notes: "",
      quantity: 1,
    },
  });

  // Reset form with fresh user info whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: "",
        address: "",
        notes: "",
        quantity: 1,
      });
    }
  }, [isOpen, reset, user]);

  const watchedQuantity = watch("quantity", 1);
  const quantity = Math.min(Math.max(Number(watchedQuantity) || 1, 1), 10);

  const pricePerUnit = Number(book?.price) || 0;
  const totalPrice = pricePerUnit * quantity;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose?.();
  };

  const handleRequireLogin = () => {
    onClose?.();
    navigate("/login", { state: { from: location } });
  };

  const onSubmit = async (data) => {
    if (!user) {
      showError("Please sign in to place an order.");
      handleRequireLogin();
      return;
    }

    if (!book?._id && !book?.id) {
      showError("Book information is missing. Please reload and try again.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        bookId: book?._id || book?.id,
        quantity,
        phoneNumber: data.phoneNumber.trim(),
        address: data.address.trim(),
        notes: data.notes?.trim() || undefined,
        userName: data.name?.trim() || user.displayName || user.email,
        email: data.email || user?.email,
      };

      const response = await post("/orders", payload);
      const createdOrder = response?.order || response?.data || response;

      showSuccess("Order placed successfully!");
      reset({
        name: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: "",
        address: "",
        notes: "",
        quantity: 1,
      });
      handleClose();

      if (createdOrder?._id) {
        navigate(`/payment/${createdOrder._id}`);
      } else {
        navigate("/dashboard/my-orders");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-sm text-base-content/60">Secure checkout</p>
            <h3 className="text-2xl font-bold">
              Order {book?.name || book?.title || "Book"}
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            aria-label="Close order modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!user && (
          <div className="alert alert-warning mb-4">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h4 className="font-semibold">Sign in required</h4>
              <p className="text-sm text-base-content/70">
                Please log in to place an order and track its status.
              </p>
            </div>
            <button
              onClick={handleRequireLogin}
              className="btn btn-sm btn-primary"
            >
              Login
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 space-y-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card bg-base-200 border border-base-300"
            >
              <div className="card-body space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Full Name
                      </span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      <User className="w-4 h-4 text-base-content/60" />
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full"
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Enter at least 2 characters",
                          },
                        })}
                        disabled={isSubmitting}
                      />
                    </label>
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.name.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Email</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      <Mail className="w-4 h-4 text-base-content/60" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full"
                        {...register("email")}
                        disabled
                      />
                    </label>
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Email is taken from your account
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Phone */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        Phone Number
                      </span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                      <Phone className="w-4 h-4 text-base-content/60" />
                      <input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        className="w-full"
                        {...register("phoneNumber", {
                          required: "Phone number is required",
                          validate: (value) =>
                            validatePhone(value) ||
                            "Enter a valid phone number",
                        })}
                        disabled={isSubmitting}
                      />
                    </label>
                    {errors.phoneNumber && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.phoneNumber.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Quantity</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      className={`input input-bordered w-full ${
                        errors.quantity ? "input-error" : ""
                      }`}
                      {...register("quantity", {
                        required: "Quantity is required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Minimum 1 copy" },
                        max: {
                          value: 10,
                          message: "Maximum 10 copies per order",
                        },
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.quantity && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.quantity.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Delivery Address
                    </span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-base-content/60 absolute left-3 top-3" />
                    <textarea
                      className="textarea textarea-bordered w-full min-h-24 pl-10"
                      placeholder="House, road, city, postal code"
                      {...register("address", {
                        required: "Delivery address is required",
                        minLength: {
                          value: 10,
                          message: "Add a bit more detail for delivery",
                        },
                      })}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.address && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.address.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Notes */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Delivery Notes (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-16"
                    placeholder="Landmark, preferred time, etc."
                    {...register("notes")}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span>
                      Secure order. You can pay now or from your dashboard.
                    </span>
                  </div>
                  <button
                    type="submit"
                    className={`btn btn-primary md:w-64 ${
                      isSubmitting ? "loading" : ""
                    }`}
                    disabled={isSubmitting || !user}
                  >
                    {isSubmitting ? "" : "Place Order"}
                  </button>
                </div>
              </div>
            </form>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body flex-row items-center gap-3">
                  <Truck className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">Fast delivery</p>
                    <p className="text-sm text-base-content/70">
                      Typically delivered within 3-5 business days
                    </p>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 border border-base-300">
                <div className="card-body flex-row items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">Flexible payment</p>
                    <p className="text-sm text-base-content/70">
                      Pay securely online or from your orders later
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-3 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-base-content/60">
                    You are ordering
                  </p>
                  <h4 className="font-semibold">
                    {book?.name || book?.title || "Book"}
                  </h4>
                  {book?.author && (
                    <p className="text-sm text-base-content/60">
                      {book.author}
                    </p>
                  )}
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Price per copy</span>
                  <span className="font-semibold">
                    {formatCurrency(pricePerUnit)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quantity</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span className="badge badge-ghost">Included</span>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="alert alert-info mt-2 text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  We use secure payment processing. You can complete payment now
                  or from your dashboard anytime.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
