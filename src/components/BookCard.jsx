import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

/**
 * Reusable Book Card Component
 * @param {object} props - Component props
 * @param {object} props.book - Book object with _id, name, author, image, price
 */
const BookCard = ({ book }) => {
  const [imageError, setImageError] = useState(false);

  const { _id, id, name, title, author, image, coverImage, imageURL, price } =
    book;

  // Use flexible property names (support both name/title and image/coverImage/imageURL)
  const bookId = _id || id;
  const bookName = name || title;
  const bookImage = imageURL || image || coverImage;
  const bookAuthor = author;

  return (
    <article className="card card-compact bg-base-100 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
      {/* Book Image */}
      <figure className="relative aspect-square bg-base-300 overflow-hidden">
        {bookImage && !imageError ? (
          <img
            src={bookImage}
            alt={`Cover of ${bookName} by ${bookAuthor}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="flex items-center justify-center w-full h-full"
            aria-label="No book cover available"
          >
            <BookOpen
              className="w-16 h-16 text-base-content/20"
              aria-hidden="true"
            />
          </div>
        )}
      </figure>

      {/* Card Body */}
      <div className="card-body">
        {/* Book Title */}
        <h2 className="card-title text-base line-clamp-2 min-h-12">
          {bookName}
        </h2>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <User className="w-4 h-4" aria-hidden="true" />
          <span className="line-clamp-1">{bookAuthor}</span>
        </div>

        {/* Price Badge */}
        <div
          className="badge badge-primary badge-lg font-semibold mt-2"
          aria-label={`Price: ${formatCurrency(price)}`}
        >
          {formatCurrency(price)}
        </div>

        {/* Card Actions */}
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/books/${bookId}`}
            className="btn btn-primary btn-sm w-full transition-all duration-300 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`View details for ${bookName}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
