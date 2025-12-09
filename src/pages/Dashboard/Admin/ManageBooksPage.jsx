import { useState } from "react";
import { Library, Search, Trash2, AlertTriangle } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import SkeletonTable from "../../../components/SkeletonTable";
import { formatCurrency } from "../../../utils/formatters";
import { showSuccess, showError } from "../../../utils/toast";
import { patch, del } from "../../../utils/api";

const ManageBooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingBookId, setUpdatingBookId] = useState(null);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const {
    data: booksData,
    loading,
    error,
    refetch,
  } = useFetch("/books/all-books-for-admin");
  const books = booksData?.books || [];

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || book.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle status toggle
  const handleStatusToggle = async (bookId, currentStatus) => {
    const newStatus =
      currentStatus?.toLowerCase() === "published"
        ? "unpublished"
        : "published";

    try {
      setUpdatingBookId(bookId);
      await patch(`/books/${bookId}/status`, { status: newStatus });
      showSuccess(
        `Book ${
          newStatus === "published" ? "published" : "unpublished"
        } successfully`
      );
      refetch();
    } catch (error) {
      showError(
        error.response?.data?.message || "Failed to update book status"
      );
    } finally {
      setUpdatingBookId(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setBookToDelete(null);
    setShowDeleteModal(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!bookToDelete) return;

    try {
      setDeletingBookId(bookToDelete._id);
      await del(`/books/${bookToDelete._id}`);
      showSuccess("Book deleted successfully");
      closeDeleteModal();
      refetch();
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete book");
    } finally {
      setDeletingBookId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Manage All Books</h1>
        <SkeletonTable />
      </div>
    );
  }

  // Empty state
  if (!books || books.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Manage All Books</h1>
          <p className="text-base-content/70">Manage all books in the system</p>
        </div>
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="bg-base-300 p-6 rounded-full">
              <Library className="w-16 h-16 text-base-content/40" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">No books found</h2>
          <p className="text-base-content/70">No books in the system yet</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Manage All Books</h1>
        <p className="text-base-content/70">Manage all books in the system</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="form-control">
          <label className="input input-bordered flex items-center gap-2">
            <Search className="w-5 h-5 opacity-70" />
            <input
              type="text"
              placeholder="Search by book name or author..."
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
      <div className="hidden lg:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>Librarian</th>
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

                {/* Librarian */}
                <td>
                  <div className="text-sm">
                    {book.librarian?.name || book.librarian?.email || "N/A"}
                  </div>
                </td>

                {/* Price */}
                <td className="font-semibold">{formatCurrency(book.price)}</td>

                {/* Status Toggle */}
                <td>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={book.status?.toLowerCase() === "published"}
                    onChange={() => handleStatusToggle(book._id, book.status)}
                    disabled={updatingBookId === book._id}
                  />
                  <span className="ml-2 text-sm">
                    {book.status?.toLowerCase() === "published"
                      ? "Published"
                      : "Unpublished"}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <button
                    onClick={() => openDeleteModal(book)}
                    className="btn btn-sm btn-error gap-2"
                    disabled={deletingBookId === book._id}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
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
                  <span className="text-sm text-base-content/70">
                    Librarian
                  </span>
                  <span className="font-medium text-sm">
                    {book.librarian?.name || book.librarian?.email || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Price</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(book.price)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Status</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-success toggle-sm"
                      checked={book.status?.toLowerCase() === "published"}
                      onChange={() => handleStatusToggle(book._id, book.status)}
                      disabled={updatingBookId === book._id}
                    />
                    <span className="text-sm">
                      {book.status?.toLowerCase() === "published"
                        ? "Published"
                        : "Unpublished"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              {/* Actions */}
              <div className="card-actions justify-end">
                <button
                  onClick={() => openDeleteModal(book)}
                  className="btn btn-sm btn-error gap-2"
                  disabled={deletingBookId === book._id}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-error/10 p-3 rounded-full">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              <h3 className="font-bold text-2xl">Confirm Delete</h3>
            </div>

            <div className="space-y-3">
              <p className="text-lg">
                Are you sure you want to delete{" "}
                <span className="font-bold">"{bookToDelete?.name}"</span>?
              </p>
              <div className="alert alert-warning">
                <AlertTriangle className="w-5 h-5" />
                <span>
                  This will delete all associated orders and cannot be undone!
                </span>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={closeDeleteModal}
                className="btn btn-ghost"
                disabled={deletingBookId}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`btn btn-error ${deletingBookId ? "loading" : ""}`}
                disabled={deletingBookId}
              >
                {deletingBookId ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooksPage;
