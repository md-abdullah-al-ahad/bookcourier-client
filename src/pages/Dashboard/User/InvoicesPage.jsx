import { Receipt, Download, CreditCard, DollarSign } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import SkeletonTable from "../../../components/SkeletonTable";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const InvoicesPage = () => {
  const {
    data: invoicesData,
    loading,
    error,
  } = useFetch("/payments/my-invoices");

  const invoices = invoicesData?.invoices || [];

  // Calculate statistics
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalPayments = invoices.length;

  // Handle print/export
  const handleExport = () => {
    window.print();
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">My Invoices</h1>
        <SkeletonTable />
      </div>
    );
  }

  // Empty state
  if (!invoices || invoices.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Invoices</h1>
          <p className="text-base-content/70">View your payment history</p>
        </div>
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="bg-base-300 p-6 rounded-full">
              <Receipt className="w-16 h-16 text-base-content/40" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">No invoices yet</h2>
          <p className="text-base-content/70">
            Your payment history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Invoices</h1>
          <p className="text-base-content/70">View your payment history</p>
        </div>
        <button onClick={handleExport} className="btn btn-outline btn-sm gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Statistics */}
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Paid</div>
          <div className="stat-value text-primary">
            {formatCurrency(totalPaid)}
          </div>
          <div className="stat-desc">Lifetime payments</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="stat-title">Successful Payments</div>
          <div className="stat-value text-secondary">{totalPayments}</div>
          <div className="stat-desc">Total transactions</div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Book Name</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                {/* Payment ID */}
                <td>
                  <span className="text-sm font-mono text-base-content/70">
                    {invoice.paymentId || invoice._id?.slice(-8) || "N/A"}
                  </span>
                </td>

                {/* Book Name */}
                <td>
                  <div className="font-medium">
                    {invoice.book?.name || invoice.bookName || "Book"}
                  </div>
                  {invoice.book?.author && (
                    <div className="text-sm text-base-content/60">
                      {invoice.book.author}
                    </div>
                  )}
                </td>

                {/* Amount */}
                <td className="font-semibold text-success">
                  {formatCurrency(invoice.amount)}
                </td>

                {/* Payment Date */}
                <td>{formatDate(invoice.createdAt || invoice.paymentDate)}</td>

                {/* Payment Method */}
                <td>
                  <span className="badge badge-outline capitalize">
                    {invoice.paymentMethod || "Cash on Delivery"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4">
        {invoices.map((invoice) => (
          <div key={invoice._id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Payment ID */}
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-5 h-5 text-primary" />
                <span className="text-sm font-mono text-base-content/60">
                  {invoice.paymentId || invoice._id?.slice(-8) || "N/A"}
                </span>
              </div>

              {/* Book Name */}
              <h3 className="font-bold text-lg mb-1">
                {invoice.book?.name || invoice.bookName || "Book"}
              </h3>
              {invoice.book?.author && (
                <p className="text-sm text-base-content/60 mb-3">
                  {invoice.book.author}
                </p>
              )}

              <div className="divider my-2"></div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Amount</span>
                  <span className="font-semibold text-lg text-success">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">
                    Payment Date
                  </span>
                  <span className="font-medium">
                    {formatDate(invoice.createdAt || invoice.paymentDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">
                    Payment Method
                  </span>
                  <span className="badge badge-outline capitalize">
                    {invoice.paymentMethod || "Cash on Delivery"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicesPage;
