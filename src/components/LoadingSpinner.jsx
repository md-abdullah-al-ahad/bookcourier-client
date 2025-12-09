/**
 * Loading Spinner Component
 * Displays a loading spinner with optional text
 * @param {object} props - Component props
 * @param {string} props.size - Spinner size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} props.text - Optional text to display below spinner
 */
const LoadingSpinner = ({ size = "md", text = "" }) => {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
    xl: "loading-xl",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <span
        className={`loading loading-spinner ${sizeClasses[size]} text-primary`}
      ></span>
      {text && (
        <p className="text-sm font-medium text-base-content/70">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
