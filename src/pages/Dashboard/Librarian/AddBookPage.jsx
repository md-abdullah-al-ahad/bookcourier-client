import { useForm } from 'react-hook-form';
import { BookPlus } from 'lucide-react';
import { showSuccess, showError } from '../../../utils/toast';
import { post } from '../../../utils/api';

const AddBookPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      status: 'published',
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Convert price to number
      const bookData = {
        ...data,
        price: parseFloat(data.price),
      };

      await post('/books/add', bookData);
      showSuccess('Book added successfully!');
      reset();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to add book. Please try again.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookPlus className="w-8 h-8 text-primary" />
          Add New Book
        </h1>
        <p className="text-base-content/70">Add a new book to your library collection</p>
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
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                {...register('name', {
                  required: 'Book name is required',
                  minLength: {
                    value: 2,
                    message: 'Book name must be at least 2 characters',
                  },
                })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name.message}</span>
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
                className={`input input-bordered w-full ${errors.author ? 'input-error' : ''}`}
                {...register('author', {
                  required: 'Author is required',
                  minLength: {
                    value: 2,
                    message: 'Author name must be at least 2 characters',
                  },
                })}
              />
              {errors.author && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.author.message}</span>
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
                className={`input input-bordered w-full ${errors.image ? 'input-error' : ''}`}
                {...register('image', {
                  required: 'Image URL is required',
                  pattern: {
                    value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                    message: 'Please enter a valid image URL (jpg, jpeg, png, webp, gif)',
                  },
                })}
              />
              {errors.image && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.image.message}</span>
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
                  className={`input input-bordered w-full ${errors.price ? 'input-error' : ''}`}
                  {...register('price', {
                    required: 'Price is required',
                    min: {
                      value: 0,
                      message: 'Price must be 0 or greater',
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.price.message}</span>
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
                  {...register('status')}
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
                {...register('category')}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Optional</span>
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
                {...register('description')}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Optional</span>
              </label>
            </div>

            <div className="divider"></div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Clear Form
              </button>
              <button
                type="submit"
                className={`btn btn-primary gap-2 ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {!isSubmitting && <BookPlus className="w-5 h-5" />}
                {isSubmitting ? 'Adding Book...' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;
