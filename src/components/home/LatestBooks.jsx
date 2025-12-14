import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useFetch from "../../hooks/useFetch";
import SkeletonCard from "../SkeletonCard";
import BookCard from "./BookCard";

const LatestBooks = () => {
  const {
    data: booksData,
    loading,
    error,
  } = useFetch("/books?sort=newest&limit=6");

  const books = booksData?.books || [];

  return (
    <section className="py-16 px-4 bg-base-200">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Latest Additions
          </h2>
          <p className="text-base-content/70 text-lg">
            Recently added books to our collection
          </p>
        </div>

        {/* Books Grid */}
        {loading ? (
          // Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-12">
            <p className="text-error text-lg mb-4">
              Failed to load latest books
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm"
            >
              Try Again
            </button>
          </div>
        ) : !books || books.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <p className="text-base-content/70 text-lg mb-4">
              No books available yet
            </p>
            <Link to="/books" className="btn btn-primary btn-sm">
              Browse All Books
            </Link>
          </div>
        ) : (
          // Books Display
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {books.map((book) => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link to="/books" className="btn btn-outline btn-primary gap-2">
                View All Books
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LatestBooks;
