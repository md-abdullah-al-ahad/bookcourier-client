import { Component } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state to display fallback UI
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
          <div className="card bg-base-100 shadow-2xl max-w-2xl w-full">
            <div className="card-body">
              {/* Error Alert */}
              <div className="alert alert-error mb-4">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">Something went wrong!</h3>
                  <div className="text-sm">
                    {this.state.error && this.state.error.toString()}
                  </div>
                </div>
              </div>

              {/* Error Details (only in development) */}
              {import.meta.env.DEV && this.state.errorInfo && (
                <div className="bg-base-200 p-4 rounded-lg mb-4">
                  <details className="cursor-pointer">
                    <summary className="font-semibold mb-2">
                      Error Details
                    </summary>
                    <pre className="text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}

              {/* Action Buttons */}
              <div className="card-actions justify-center gap-4">
                <button
                  onClick={this.handleGoHome}
                  className="btn btn-primary gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go to Home
                </button>
                <button
                  onClick={this.handleReload}
                  className="btn btn-outline gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
