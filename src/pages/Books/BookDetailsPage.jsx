import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, User, BookOpen, Home, ChevronRight } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import PageLoader from "../../components/PageLoader";
import OrderModal from "../../components/modals/OrderModal";
import ReviewsSection from "../../components/ReviewsSection";
import { showSuccess, showError } from "../../utils/toast";
import { formatCurrency } from "../../utils/formatters";
import { post, del, get } from "../../utils/api";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);

  // Fetch book details
  const {
    data: bookData,
    loading: bookLoading,
    error: bookError,
  } = useFetch(`/books/${id}`);

  // Check if book is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        setCheckingWishlist(true);
        const response = await get("/wishlist");
        const wishlistItems = response?.wishlist || [];
        const isBookInWishlist = wishlistItems.some(
          (item) => (item.book?._id || item.book) === id
        );
        setIsInWishlist(isBookInWishlist);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      } finally {
        setCheckingWishlist(false);
      }
    };

    if (id) {
      checkWishlist();
    }
  }, [id]);

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

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async () => {
    try {
      setWishlistLoading(true);
      await del(`/wishlist/${id}`);
      setIsInWishlist(false);
      showSuccess("Removed from wishlist successfully!");
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  // Handle order now
  const handleOrderNow = () => {
    setShowOrderModal(true);
  };

  // Show loading state while fetching
  if (bookLoading || !bookData) {
    return <PageLoader />;
  }

  // Extract book after loading is complete
  const book = bookData?.book || bookData;

  // Show error state only if there's a 404 error
  if (bookError?.response?.status === 404) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="bg-error/10 p-6 rounded-full">
              <BookOpen className="w-16 h-16 text-error" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Book Not Found</h1>
          <p className="text-base-content/70 mb-6 max-w-md mx-auto">
            The book you're looking for doesn't exist or has been removed from
            our collection.
          </p>
          <Link to="/books" className="btn btn-primary gap-2">
            <BookOpen className="w-5 h-5" />
            Browse All Books
          </Link>
        </div>
      </div>
    );
  }

  // If there's an error but not 404, show generic error
  if (bookError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold mb-4 text-error">
            Error Loading Book
          </h1>
          <p className="text-base-content/70 mb-6">
            {bookError.message || "Something went wrong"}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Retry
            </button>
            <Link to="/books" className="btn btn-outline">
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Final safety check - if no book after all checks, show loader
  if (!book) {
    return <PageLoader />;
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
    <div className="min-h-screen bg-base-200 py-8 px-4 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li>
              <Link
                to="/"
                className="flex items-center gap-1 transition-colors duration-200 hover:text-primary"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/books"
                className="flex items-center gap-1 transition-colors duration-200 hover:text-primary"
              >
                <BookOpen className="w-4 h-4" />
                All Books
              </Link>
            </li>
            <li className="text-base-content/70">{book.name || book.title}</li>
          </ul>
        </div>

        {/* Book Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Book Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="card bg-base-100 shadow-xl w-full max-w-md hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-8 pt-8">
                <img
                  src={
                    book.image ||
                    book.imageURL ||
                    "https://via.placeholder.com/400x600?text=Book+Cover"
                  }
                  alt={book.name || book.title}
                  className="rounded-lg w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x600?text=Book+Cover";
                  }}
                />
              </figure>
            </div>
          </div>

          {/* Right: Book Information */}
          <div className="flex flex-col justify-center">
            <div className="card bg-base-100 shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {book.name || book.title}
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
                <div className="mb-6 p-3 bg-base-200 rounded-lg">
                  <span className="text-sm text-base-content/60">
                    Provided by:{" "}
                  </span>
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
                  className="btn btn-primary btn-lg flex-1 gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Order Now
                </button>
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading || checkingWishlist}
                  className={`btn btn-outline btn-lg ${
                    isInWishlist ? "btn-success" : "btn-primary"
                  }`}
                >
                  {wishlistLoading || checkingWishlist ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist ? "fill-current" : ""
                      }`}
                    />
                  )}
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section with submission form */}
        <ReviewsSection bookId={id} />
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
