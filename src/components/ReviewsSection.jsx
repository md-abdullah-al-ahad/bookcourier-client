import { useState, useEffect } from "react";
import { Star, UserCircle } from "lucide-react";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import { get, post } from "../utils/api";
import { showSuccess, showError } from "../utils/toast";

/**
 * ReviewsSection Component
 * Displays reviews for a book and allows users who ordered it to add reviews
 * @param {object} props - Component props
 * @param {string} props.bookId - ID of the book to show reviews for
 */
const ReviewsSection = ({ bookId }) => {
  const { user } = useAuth();
  const [canReview, setCanReview] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch reviews
  const {
    data: reviewsData,
    loading: reviewsLoading,
    refetch: refetchReviews,
  } = useFetch(`/reviews/book/${bookId}`);

  const reviews = reviewsData?.reviews || [];

  // Check if user can review (must have ordered this book)
  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!user || !bookId) {
        setCanReview(false);
        setCheckingEligibility(false);
        return;
      }

      try {
        // Check if user has ordered this book
        const response = await get(`/orders/can-review/${bookId}`);
        setCanReview(response?.canReview || false);
      } catch {
        setCanReview(false);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkReviewEligibility();
  }, [user, bookId]);

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      showError("Please write a comment");
      return;
    }

    try {
      setSubmitting(true);
      await post("/reviews", {
        bookId,
        rating,
        comment: comment.trim(),
      });

      showSuccess("Review submitted successfully!");
      setRating(0);
      setComment("");
      refetchReviews();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Render star rating
  const renderStars = (currentRating, isInteractive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= (isInteractive ? hoverRating || rating : currentRating)
                ? "fill-warning text-warning"
                : "text-base-300"
            } ${isInteractive ? "cursor-pointer transition-colors" : ""}`}
            onClick={isInteractive ? () => setRating(star) : undefined}
            onMouseEnter={
              isInteractive ? () => setHoverRating(star) : undefined
            }
            onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  return (
    <section className="mt-12">
      {/* Section Header */}
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Add Review Form - Only for eligible users */}
      {user && !checkingEligibility && canReview && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              {/* Star Rating Selector */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Your Rating</span>
                </label>
                {renderStars(rating, true)}
              </div>

              {/* Comment Textarea */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Your Review</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Share your thoughts about this book..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary ${submitting ? "loading" : ""}`}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviewsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-24"></div>
                    <div className="skeleton h-16 w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="bg-base-300 p-6 rounded-full">
              <Star className="w-12 h-12 text-base-content/40" />
            </div>
          </div>
          <p className="text-xl font-semibold mb-2">No reviews yet</p>
          <p className="text-base-content/70">
            Be the first to review this book!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      {review.user?.photoURL ? (
                        <img
                          src={review.user.photoURL}
                          alt={`${
                            review.user?.name || "User"
                          }'s profile picture`}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="bg-primary text-primary-content flex items-center justify-center w-full h-full"
                          role="img"
                          aria-label={`${
                            review.user?.name || "User"
                          }'s profile picture`}
                        >
                          <UserCircle className="w-8 h-8" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    {/* User Name */}
                    <h4 className="font-semibold text-lg">
                      {review.user?.name || "Anonymous"}
                    </h4>

                    {/* Star Rating and Date */}
                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-base-content/60">
                        {getRelativeTime(review.createdAt)}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-base-content/80">{review.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
