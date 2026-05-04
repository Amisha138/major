import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
      <div className="w-full rounded-[2rem] border-2 border-[#1A1A1A] bg-white p-8 text-center book-shadow-lg sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.35rem] border-2 border-[#1A1A1A] bg-[#93C5FD] book-shadow-sm">
          <Compass className="h-8 w-8 text-[#1A1A1A]" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#7A766D]">
          404
        </p>
        <h1 className="mt-3 font-heading text-4xl text-[#1A1A1A] sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#5C574F] sm:text-base">
          This link does not point to an active BookWeb page. Head back to the marketplace and
          continue browsing student listings.
        </p>
        <Link to="/" className="book-button-dark mt-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
