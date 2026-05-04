import { Component } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error,
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("BookWeb UI crashed", error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({
        error: null,
        hasError: false,
      });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-[#FAFAF7] px-4 py-10 text-[#1A1A1A] sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <section className="w-full rounded-[2rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow-lg sm:p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] border-2 border-[#1A1A1A] bg-[#FDE2E2] book-shadow-sm">
              <AlertTriangle className="h-8 w-8 text-[#B91C1C]" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#7A766D]">
              Something crashed
            </p>
            <h1 className="mt-3 font-heading text-4xl text-[#1A1A1A] sm:text-5xl">
              A quick reset will get us moving again.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#5C574F] sm:text-base">
              The interface hit an unexpected error. You can reload this page or head back to
              the home feed without losing your session cookie.
            </p>

            <div className="mt-8 rounded-[1.35rem] border-2 border-[#1A1A1A] bg-[#FFFDF8] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7A766D]">
                Error details
              </p>
              <p className="mt-2 break-words text-sm leading-6 text-[#5C574F]">
                {this.state.error?.message || "An unexpected interface error occurred."}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="book-button-dark"
              >
                <RotateCcw className="h-4 w-4" />
                Reload Page
              </button>
              <Link to="/" className="book-button-light">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
