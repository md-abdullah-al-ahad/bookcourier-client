import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Search, Edit, PlusCircle } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import SkeletonTable from "../../../components/SkeletonTable";
import { formatCurrency } from "../../../utils/formatters";

const MyBooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const { data: booksData, loading, error } = useFetch("/books/librarian");
  const books = booksData?.books || [];

  // Filter books based on search and status
  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || book.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    return status?.toLowerCase() === "published"
      ? "badge-success"
      : "badge-warning";
  };

  // Handle edit
  const handleEdit = (bookId) => {
    navigate(`/dashboard/my-books/edit/${bookId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">My Books</h1>
        <SkeletonTable />
      </div>
    );
  }

  // Empty state
  if (!books || books.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Books</h1>
          <p className="text-base-content/70">Manage your book collection</p>
        </div>
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="bg-base-300 p-6 rounded-full">
              <BookOpen className="w-16 h-16 text-base-content/40" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">No books added yet</h2>
          <p className="text-base-content/70 mb-6">
            Start building your library by adding your first book!
          </p>
          <Link to="/dashboard/add-book" className="btn btn-primary gap-2">
            <PlusCircle className="w-5 h-5" />
            Add Book
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Books</h1>
        <p className="text-base-content/70">Manage your book collection</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="form-control">
          <label className="input input-bordered flex items-center gap-2">
            <Search className="w-5 h-5 opacity-70" />
            <input
              type="text"
              placeholder="Search by book name..."
              className="grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        {/* Status Filter */}
        <div className="form-control">
          <select
            className="select select-bordered w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-base-content/70">
        Showing {filteredBooks.length} of {books.length} books
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book._id}>
                {/* Image */}
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={book.image || "https://via.placeholder.com/100"}
                        alt={book.name}
                      />
                    </div>
                  </div>
                </td>

                {/* Book Name */}
                <td>
                  <div className="font-semibold">{book.name}</div>
                  {book.category && (
                    <div className="text-sm text-base-content/60">
                      {book.category}
                    </div>
                  )}
                </td>

                {/* Author */}
                <td>{book.author}</td>

                {/* Price */}
                <td className="font-semibold">{formatCurrency(book.price)}</td>

                {/* Status */}
                <td>
                  <span
                    className={`badge ${getStatusBadge(
                      book.status
                    )} capitalize`}
                  >
                    {book.status || "Published"}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <button
                    onClick={() => handleEdit(book._id)}
                    className="btn btn-sm btn-primary gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredBooks.map((book) => (
          <div key={book._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Book Info */}
              <div className="flex items-start gap-3 mb-4">
                <div className="avatar">
                  <div className="w-20 h-20 rounded-lg">
                    <img
                      src={book.image || "https://via.placeholder.com/100"}
                      alt={book.name}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{book.name}</h3>
                  <p className="text-sm text-base-content/60">{book.author}</p>
                  {book.category && (
                    <p className="text-xs text-base-content/50 mt-1">
                      {book.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Price</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(book.price)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Status</span>
                  <span
                    className={`badge ${getStatusBadge(
                      book.status
                    )} capitalize`}
                  >
                    {book.status || "Published"}
                  </span>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Actions */}
              <div className="card-actions justify-end">
                <button
                  onClick={() => handleEdit(book._id)}
                  className="btn btn-sm btn-primary gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredBooks.length === 0 && books.length > 0 && (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">No books found</p>
          <p className="text-base-content/70">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;
