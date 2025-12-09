import { Link } from 'react-router-dom';
import { FileQuestion, Home, BookOpen } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 animate-fade-in">
      <div className="card bg-base-100 shadow-2xl max-w-lg w-full">
        <div className="card-body text-center py-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-error/10 p-8 rounded-full">
              <FileQuestion className="w-24 h-24 text-error" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            404 - Page Not Found
          </h1>

          {/* Subtext */}
          <p className="text-base-content/70 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="card-actions justify-center gap-4">
            <Link to="/" className="btn btn-primary gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link to="/books" className="btn btn-outline gap-2">
              <BookOpen className="w-5 h-5" />
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
