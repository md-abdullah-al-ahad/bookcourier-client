import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import PageLoader from "../../../components/PageLoader";
import { showSuccess, showError } from "../../../utils/toast";
import { put } from "../../../utils/api";

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: bookData, loading, error } = useFetch(`/books/${id}`);
  const book = bookData?.book || bookData;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Pre-fill form when book data loads
  useEffect(() => {
    if (book) {
      setValue("name", book.name || "");
      setValue("author", book.author || "");
      setValue("image", book.image || "");
      setValue("price", book.price || 0);
      setValue("status", book.status || "published");
      setValue("category", book.category || "");
      setValue("description", book.description || "");
    }
  }, [book, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Convert price to number
      const bookData = {
        ...data,
        price: parseFloat(data.price),
      };

      await put(`/books/${id}`, bookData);
      showSuccess("Book updated successfully!");
      navigate("/dashboard/my-books");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Failed to update book. Please try again."
      );
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/dashboard/my-books");
  };

  // Loading state
  if (loading) {
    return <PageLoader />;
  }

  // Error/Not found state
  if (error || !book) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Book Not Found</h1>
        <p className="text-base-content/70 mb-6">
          The book you're looking for doesn't exist or you don't have access to
          it.
        </p>
        <button
          onClick={() => navigate("/dashboard/my-books")}
          className="btn btn-primary gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Books
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="btn btn-ghost btn-sm gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Books
        </button>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          Edit Book
        </h1>
        <p className="text-base-content/70">Update book information</p>
      </div>

      {/* Form Card */}
      <div className="card bg-base-100 shadow-xl max-w-3xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Book Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Book Name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter book name"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                {...register("name", {
                  required: "Book name is required",
                  minLength: {
                    value: 2,
                    message: "Book name must be at least 2 characters",
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

            {/* Author */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Author <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                className={`input input-bordered w-full ${
                  errors.author ? "input-error" : ""
                }`}
                {...register("author", {
                  required: "Author is required",
                  minLength: {
                    value: 2,
                    message: "Author name must be at least 2 characters",
                  },
                })}
              />
              {errors.author && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.author.message}
                  </span>
                </label>
              )}
            </div>

            {/* Image URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Image URL <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/book-cover.jpg"
                className={`input input-bordered w-full ${
                  errors.image ? "input-error" : ""
                }`}
                {...register("image", {
                  required: "Image URL is required",
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                    message:
                      "Please enter a valid image URL (jpg, jpeg, png, webp, gif)",
                  },
                })}
              />
              {errors.image && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.image.message}
                  </span>
                </label>
              )}
            </div>

            {/* Price and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Price (৳) <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`input input-bordered w-full ${
                    errors.price ? "input-error" : ""
                  }`}
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be 0 or greater",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.price.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  {...register("status")}
                >
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
              </div>
            </div>

            {/* Category */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Fiction, Science, History"
                className="input input-bordered w-full"
                {...register("category")}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Optional
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                placeholder="Enter book description..."
                className="textarea textarea-bordered h-32"
                {...register("description")}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Optional
                </span>
              </label>
            </div>

            <div className="divider"></div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
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
                className={`btn btn-primary gap-2 ${
                  isSubmitting ? "loading" : ""
                }`}
                disabled={isSubmitting}
              >
                {!isSubmitting && <BookOpen className="w-5 h-5" />}
                {isSubmitting ? "Updating Book..." : "Update Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;
