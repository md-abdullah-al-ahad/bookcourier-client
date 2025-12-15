import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  BookOpen,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { post } from "../../utils/api";
import { formatCurrency } from "../../utils/formatters";
import { showError, showSuccess } from "../../utils/toast";
import { validatePhone } from "../../utils/validation";

/**
 * Order placement modal displayed from the book details page.
 * Name and email come from the signed-in user and are read-only.
 */
const OrderModal = ({ isOpen, onClose, book }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeTimerRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: user?.displayName || user?.email || "",
      userEmail: user?.email || "",
      phone: "",
      address: "",
    },
  });

  // Reset form data whenever the modal opens or user data changes
  useEffect(() => {
    if (isOpen) {
      reset({
        userName: user?.displayName || user?.email || "",
        userEmail: user?.email || "",
        phone: "",
        address: "",
      });
    }
  }, [isOpen, reset, user]);

  // Clear any pending close timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose?.();
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      showError("Please sign in to place an order.");
      return;
    }

    if (!book?._id && !book?.id) {
      showError("Book information is missing. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);

      await post("/orders", {
        bookId: book?._id || book?.id,
        quantity: 1,
        phoneNumber: data.phone.trim(),
        address: data.address.trim(),
        userName: data.userName,
        userEmail: data.userEmail,
      });

      showSuccess("Order placed successfully!");
      reset({
        userName: user?.displayName || user?.email || "",
        userEmail: user?.email || "",
        phone: "",
        address: "",
      });

      closeTimerRef.current = setTimeout(() => {
        onClose?.();
      }, 1200);
    } catch (error) {
      showError(error?.response?.data?.message || "Failed to place order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-base-100 shadow-2xl border border-base-300"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close order modal"
          disabled={isSubmitting}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Book details header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center justify-center w-full sm:w-40 aspect-[3/4] bg-base-200 rounded-xl overflow-hidden border border-base-300">
              {book?.imageURL || book?.image || book?.coverImage ? (
                <img
                  src={book.imageURL || book.image || book.coverImage}
                  alt={book?.title || book?.name || "Book cover"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookOpen className="w-12 h-12 text-base-content/50" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-base-content/60">Ordering</p>
              <h3 className="text-2xl font-bold leading-tight">
                {book?.name || book?.title || "Book"}
              </h3>
              {book?.author && (
                <p className="text-base-content/70">by {book.author}</p>
              )}
              <div className="flex items-center gap-3">
                <span className="badge badge-outline">In stock</span>
                <span className="text-xl font-semibold text-primary">
                  {formatCurrency(book?.price || 0)}
                </span>
              </div>
            </div>
          </div>

          {!user && (
            <div className="alert alert-warning">
              <AlertCircle className="w-5 h-5" />
              <div>
                <h4 className="font-semibold">Sign in required</h4>
                <p className="text-sm text-base-content/70">
                  You need to be signed in to place an order.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 rounded-xl border border-base-300 bg-base-100 p-4 sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <User className="w-4 h-4 text-base-content/60" />
                    <input
                      type="text"
                      className="w-full"
                      readOnly
                      {...register("userName")}
                    />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <Mail className="w-4 h-4 text-base-content/60" />
                    <input
                      type="email"
                      className="w-full"
                      readOnly
                      {...register("userEmail")}
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Phone</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <Phone className="w-4 h-4 text-base-content/60" />
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="w-full"
                      {...register("phone", {
                        required: "Phone number is required",
                        validate: (value) =>
                          validatePhone(value) || "Enter a valid phone number",
                      })}
                      disabled={isSubmitting}
                    />
                  </label>
                  {errors.phone && (
                    <p className="text-sm text-error mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Address</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-base-content/60 absolute left-3 top-3" />
                    <textarea
                      className={`textarea textarea-bordered w-full min-h-20 pl-10 ${
                        errors.address ? "textarea-error" : ""
                      }`}
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
                    <p className="text-sm text-error mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>Secure checkout. We never share your details.</span>
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary w-full sm:w-auto ${
                    isSubmitting ? "loading" : ""
                  }`}
                  disabled={isSubmitting || !user}
                >
                  {isSubmitting ? "" : "Place Order"}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <div className="rounded-xl border border-base-300 bg-base-200/60 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60">Order summary</p>
                    <p className="font-semibold">
                      {book?.name || book?.title || "Book"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Price</span>
                  <span className="font-semibold">
                    {formatCurrency(book?.price || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Delivery</span>
                  <span className="badge badge-ghost">Included</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(book?.price || 0)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-base-300 bg-base-100 p-4 sm:p-5 text-sm space-y-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-success mt-1" />
                  <div>
                    <p className="font-semibold">You’re protected</p>
                    <p className="text-base-content/70">
                      We’ll send order updates to your email. Your details are
                      encrypted and never shared.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
