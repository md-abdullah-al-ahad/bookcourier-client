/**
 * Skeleton Card Component
 * Loading placeholder for book cards
 */
const SkeletonCard = () => {
  return (
    <div className="card bg-base-100 shadow-xl animate-pulse">
      <figure className="h-64 bg-base-300"></figure>
      <div className="card-body">
        <div className="h-6 bg-base-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-base-300 rounded w-full"></div>
          <div className="h-3 bg-base-300 rounded w-5/6"></div>
        </div>
        <div className="card-actions justify-between items-center mt-4">
          <div className="h-6 bg-base-300 rounded w-20"></div>
          <div className="h-10 bg-base-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
