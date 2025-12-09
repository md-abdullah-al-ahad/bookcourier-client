import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import BookCard from "../../components/BookCard";
import SkeletonCard from "../../components/SkeletonCard";
import useDebounce from "../../hooks/useDebounce";
import useFetch from "../../hooks/useFetch";
import { showError } from "../../utils/toast";

const AllBooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Build API URL with query params
  const apiUrl = `/books?search=${debouncedSearch}&sort=${sortBy}&page=${currentPage}&limit=12`;
  const { data, loading, error, refetch } = useFetch(apiUrl);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (sortBy !== "newest") params.sort = sortBy;
    if (currentPage > 1) params.page = currentPage;
    setSearchParams(params);
  }, [debouncedSearch, sortBy, currentPage, setSearchParams]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const books = data?.books || [];
  const totalPages = data?.totalPages || 1;
  const totalBooks = data?.totalCount || 0;

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-base-200 animate-fade-in">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Browse Our Collection
          </h1>
          <p className="text-base-content/70">
            Explore{" "}
            {totalBooks > 0 ? `${totalBooks} books` : "our amazing selection"}{" "}
            from local libraries
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <Search className="w-5 h-5 opacity-70" />
              <input
                type="text"
                placeholder="Search by book name..."
                className="grow"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </label>
          </div>

          {/* Sort Dropdown */}
          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-error text-lg mb-4">Failed to load books</p>
            <button onClick={refetch} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl font-semibold mb-2">No books found</p>
            <p className="text-base-content/70">
              {searchTerm
                ? `No results for "${searchTerm}". Try a different search term.`
                : "No books available at the moment."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {books.map((book) => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="btn-group">
                  {/* Previous Button */}
                  <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <button
                        key={`ellipsis-${index}`}
                        className="btn btn-disabled"
                      >
                        ...
                      </button>
                    ) : (
                      <button
                        key={page}
                        className={`btn ${
                          currentPage === page ? "btn-active" : ""
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Button */}
                  <button
                    className="btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBooksPage;
