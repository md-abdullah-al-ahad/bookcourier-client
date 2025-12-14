import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Eye, BookOpen } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import SkeletonCard from "../../../components/SkeletonCard";
import { formatCurrency } from "../../../utils/formatters";
import { showSuccess, showError } from "../../../utils/toast";
import { del, post } from "../../../utils/api";

const WishlistPage = () => {
  const { data: wishlistData, loading, error, refetch } = useFetch("/wishlist");
  const [removingId, setRemovingId] = useState(null);

  const wishlistItems = wishlistData?.wishlist || [];

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (bookId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this book from your wishlist?"
    );
    if (!confirmed) return;

    try {
      setRemovingId(bookId);
      await del(`/wishlist/${bookId}`);
      showSuccess("Removed from wishlist successfully!");
      refetch();
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
    } finally {
      setRemovingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-base-content/70">Books you've saved for later</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-error">
            Failed to load wishlist
          </h2>
          <p className="text-base-content/70 mb-6">{error.message}</p>
          <button onClick={refetch} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (wishlistItems.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-base-content/70">Books you've saved for later</p>
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-primary/10 p-6 rounded-full">
                <Heart className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-base-content/70 mb-6 max-w-md mx-auto">
              Start adding books you'd like to read later by clicking the heart
              icon on any book.
            </p>
            <Link to="/books" className="btn btn-primary gap-2">
              <BookOpen className="w-5 h-5" />
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-base-content/70">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "book" : "books"} saved for later
            </p>
          </div>
          <div className="stats shadow">
            <div className="stat place-items-center">
              <div className="stat-title">Total Books</div>
              <div className="stat-value text-primary">
                {wishlistItems.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const book = item.book || item;
          return (
            <div
              key={item._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 group"
            >
              {/* Book Image */}
              <figure className="relative overflow-hidden h-64">
                <img
                  src={
                    book.imageURL ||
                    book.image ||
                    book.coverImage ||
                    "/placeholder-book.jpg"
                  }
                  alt={book.title || book.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/placeholder-book.jpg";
                  }}
                />
                {/* Remove Button Overlay */}
                <button
                  onClick={() => handleRemoveFromWishlist(book._id)}
                  disabled={removingId === book._id}
                  className="absolute top-3 right-3 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from wishlist"
                >
                  {removingId === book._id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </figure>

              <div className="card-body p-4">
                {/* Title */}
                <h2 className="card-title text-lg line-clamp-2 min-h-[3.5rem]">
                  {book.title}
                </h2>

                {/* Author */}
                <p className="text-sm text-base-content/70 mb-2">
                  by {book.author}
                </p>

                {/* Category Badge */}
                <div className="mb-2">
                  <span className="badge badge-primary badge-sm">
                    {book.category}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(book.price)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="card-actions justify-between gap-2">
                  <Link
                    to={`/books/${book._id}`}
                    className="btn btn-outline btn-sm flex-1 gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(book._id)}
                    disabled={removingId === book._id}
                    className="btn btn-ghost btn-sm btn-circle text-error"
                    title="Remove"
                  >
                    {removingId === book._id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <Heart className="w-4 h-4 fill-current" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
