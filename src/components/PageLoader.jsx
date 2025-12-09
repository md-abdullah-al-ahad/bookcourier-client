/**
 * Page Loader Component
 * Full page loading overlay with spinner
 */
const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-xl text-primary"></span>
        <p className="text-lg font-semibold text-base-content">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;
