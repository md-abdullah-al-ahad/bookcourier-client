import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, User, BookOpen, Home, ChevronRight } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import PageLoader from "../../components/PageLoader";
import OrderModal from "../../components/modals/OrderModal";
import { showSuccess, showError } from "../../utils/toast";
import { formatCurrency } from "../../utils/formatters";
import { post } from "../../utils/api";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Fetch book details
  const {
    data: book,
    loading: bookLoading,
    error: bookError,
  } = useFetch(`/books/${id}`);

  // Fetch reviews
  const { data: reviewsData, loading: reviewsLoading } = useFetch(
    `/reviews/book/${id}`
  );

  const reviews = reviewsData?.reviews || [];

  // Handle add to wishlist
  const handleAddToWishlist = async () => {
    try {
      setWishlistLoading(true);
      await post("/wishlist", { bookId: id });
      setIsInWishlist(true);
      showSuccess("Added to wishlist successfully!");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to add to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle order now
  const handleOrderNow = () => {
    setShowOrderModal(true);
  };

  // Show loading state
  if (bookLoading) {
    return <PageLoader />;
  }

  // Show error state (book not found)
  if (bookError || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Book Not Found</h1>
          <p className="text-base-content/70 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/books" className="btn btn-primary">
            Browse All Books
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      published: "badge-success",
      draft: "badge-warning",
      archived: "badge-error",
    };
    return statusColors[status?.toLowerCase()] || "badge-ghost";
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li>
              <Link to="/" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/books" className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                All Books
              </Link>
            </li>
            <li className="text-base-content/70">{book.name}</li>
          </ul>
        </div>

        {/* Book Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Book Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
              <figure className="px-8 pt-8">
                <img
                  src={
                    book.image ||
                    "https://via.placeholder.com/400x600?text=Book+Cover"
                  }
                  alt={book.name}
                  className="rounded-lg w-full h-96 object-cover"
                />
              </figure>
            </div>
          </div>

          {/* Right: Book Information */}
          <div className="flex flex-col justify-center">
            <div className="card bg-base-100 shadow-xl p-8">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {book.name}
              </h1>

              {/* Author */}
              {book.author && (
                <div className="flex items-center gap-2 mb-3 text-lg">
                  <User className="w-5 h-5 text-base-content/70" />
                  <span className="text-base-content/80">by {book.author}</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <span className="badge badge-lg badge-primary text-xl font-bold px-6 py-4">
                  {formatCurrency(book.price)}
                </span>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`badge ${getStatusBadge(book.status)} badge-lg`}
                >
                  {book.status || "Published"}
                </span>
              </div>

              {/* Category */}
              {book.category && (
                <div className="mb-4">
                  <span className="text-sm font-semibold text-base-content/60">
                    Category:
                  </span>
                  <span className="ml-2 text-base">{book.category}</span>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-base-content/80 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              {/* Librarian */}
              {book.librarian && (
                <div className="mb-6 text-sm text-base-content/60">
                  <span>Provided by: </span>
                  <span className="font-medium">
                    {book.librarian.name || book.librarian.email}
                  </span>
                </div>
              )}

              <div className="divider"></div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleOrderNow}
                  className="btn btn-primary btn-lg flex-1"
                >
                  <BookOpen className="w-5 h-5" />
                  Order Now
                </button>
                <button
                  onClick={handleAddToWishlist}
                  disabled={isInWishlist || wishlistLoading}
                  className={`btn btn-outline btn-lg ${
                    isInWishlist ? "btn-success" : ""
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="card bg-base-100 shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <p>No reviews yet. Be the first to review this book!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-base-300 pb-4 last:border-0"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < review.rating
                                ? "text-warning"
                                : "text-base-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-base-content/60">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-base-content/80">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        book={book}
      />
    </div>
  );
};

export default BookDetailsPage;
