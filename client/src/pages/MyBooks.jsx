import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BookOpenText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import { getErrorMessage } from "../utils/errors";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchMyBooks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get("/api/users/mybooks");

        if (!ignore) {
          setBooks(response.data.data.books);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchMyBooks();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const handleDeleteBook = async () => {
    if (!bookToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await api.delete(`/api/books/${bookToDelete._id}`);
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book._id !== bookToDelete._id),
      );
      toast.success("Book deleted successfully");
      setBookToDelete(null);
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
              Dashboard
            </p>
            <h1 className="mt-3 font-heading text-[2.9rem] leading-none text-[#1A1A1A]">
              My Books
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5C574F]">
              Keep your listings fresh, remove sold-out books, and manage which titles are
              still visible to students browsing BookWeb.
            </p>
          </div>

          <Link to="/upload" className="book-button-dark">
            Upload New Book
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => index).map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-[#FFF1F1] p-6 book-shadow">
            <p className="font-heading text-2xl text-[#1A1A1A]">Could not load your books</p>
            <p className="mt-3 text-sm leading-7 text-[#9F2F2F]">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="book-button-dark mt-5"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {!isLoading && !error && books.length === 0 ? (
          <div className="rounded-[1.5rem] border-2 border-dashed border-[#1A1A1A] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-[#F6F1E6]">
              <BookOpenText className="h-7 w-7 text-[#1A1A1A]" />
            </div>
            <h2 className="mt-5 font-heading text-3xl text-[#1A1A1A]">No listings yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6B6B6B]">
              Your uploaded books will show up here. Add your first listing with a clear cover
              image, fair price, and complete details.
            </p>
            <Link to="/upload" className="book-button-dark mt-6">
              Upload a Book
            </Link>
          </div>
        ) : null}

        {!isLoading && !error && books.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                showAvailability
                footer={
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-[#6B6B6B]">
                      {book.isAvailable ? "Visible to buyers" : "Hidden from public browse"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setBookToDelete(book)}
                      className="book-button-light !px-4 !py-2 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        ) : null}
      </section>

      {bookToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
              Delete listing
            </p>
            <h2 className="mt-3 font-heading text-3xl text-[#1A1A1A]">
              {bookToDelete.bookname}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#5C574F]">
              This permanently removes the listing and its uploaded image. This action cannot
              be undone.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                disabled={isDeleting}
                className="book-button-light flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteBook}
                disabled={isDeleting}
                className="book-button-dark flex-1"
              >
                {isDeleting ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MyBooks;
