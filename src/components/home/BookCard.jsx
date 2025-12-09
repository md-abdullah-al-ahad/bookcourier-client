import { Link } from "react-router-dom";
import { BookOpen, User } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

/**
 * Book Card Component
 * Displays a book with image, title, author, and price
 * @param {object} props - Component props
 * @param {object} props.book - Book object
 */
const BookCard = ({ book }) => {
  const {
    _id,
    id,
    title,
    author,
    coverImage,
    price,
    category,
    rating,
    availableCopies,
  } = book;

  const bookId = _id || id;
  const isAvailable = availableCopies > 0;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      {/* Book Cover Image */}
      <figure className="relative h-64 bg-base-300">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <BookOpen className="w-20 h-20 text-base-content/20" />
          </div>
        )}

        {/* Availability Badge */}
        {!isAvailable && (
          <div className="badge badge-error absolute top-2 right-2">
            Out of Stock
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="badge badge-primary absolute top-2 left-2">
            {category}
          </div>
        )}
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        {/* Title */}
        <h3 className="card-title text-lg line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 text-base-content/70 text-sm mb-2">
          <User className="w-4 h-4" />
          <span className="line-clamp-1">{author}</span>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="rating rating-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <input
                  key={index}
                  type="radio"
                  className="mask mask-star-2 bg-orange-400"
                  checked={index < Math.floor(rating)}
                  disabled
                />
              ))}
            </div>
            <span className="text-sm text-base-content/70">({rating})</span>
          </div>
        )}

        {/* Price and Action */}
        <div className="card-actions justify-between items-center mt-2">
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(price)}
          </div>
          <Link
            to={`/books/${bookId}`}
            className={`btn btn-sm ${
              isAvailable ? "btn-primary" : "btn-disabled"
            }`}
          >
            {isAvailable ? "View Details" : "Unavailable"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
