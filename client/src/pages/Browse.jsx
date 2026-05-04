import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Repeat2,
  SearchX,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import BookCard from "../components/BookCard";
import SkeletonCard from "../components/SkeletonCard";
import {
  buildBookSearchParams,
  CATEGORY_CARD_OPTIONS,
  formatClassLabel,
  getActiveFilterKey,
} from "../utils/books";
import { getErrorMessage } from "../utils/errors";

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
};

function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalBooks: 0,
    totalPages: 1,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const openToExchange = searchParams.get("openToExchange") === "true";
  const currentPage = Math.max(Number.parseInt(searchParams.get("page") || "1", 10) || 1, 1);
  const activeFilter = getActiveFilterKey({ category, openToExchange });

  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get("/api/books", {
          params: {
            search: search || undefined,
            category: category !== "all" ? category : undefined,
            openToExchange: openToExchange ? true : undefined,
            page: currentPage,
            limit: 12,
          },
        });

        if (!ignore) {
          setBooks(response.data.data.books);
          setPagination({
            currentPage: response.data.data.currentPage,
            totalBooks: response.data.data.totalBooks,
            totalPages: response.data.data.totalPages,
          });
        }
      } catch (requestError) {
        if (!ignore) {
          setError(getErrorMessage(requestError, "Failed to load books"));
          setBooks([]);
          setPagination({
            currentPage: 1,
            totalBooks: 0,
            totalPages: 1,
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [category, currentPage, openToExchange, reloadKey, search]);

  const visiblePages = useMemo(
    () => getVisiblePages(pagination.currentPage, pagination.totalPages),
    [pagination.currentPage, pagination.totalPages],
  );

  const updateFilters = (nextFilter, nextPage = 1) => {
    const isExchangeFilter = nextFilter === "exchange";

    setSearchParams(
      buildBookSearchParams({
        search,
        category: isExchangeFilter ? "all" : nextFilter,
        openToExchange: isExchangeFilter,
        page: nextPage,
      }),
    );
  };

  const goToPage = (page) => {
    setSearchParams(
      buildBookSearchParams({
        search,
        category,
        openToExchange,
        page,
      }),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const filterSummary = openToExchange
    ? "Exchange only"
    : category === "all"
      ? "All classes"
      : formatClassLabel(category);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#93C5FD] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
          <BookOpenText className="h-4 w-4" />
          Browse Marketplace
        </span>
        <h1 className="mt-5 font-heading text-[3rem] leading-none text-[#1A1A1A] sm:text-[3.8rem]">
          Find the right books for your next class.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#5C574F]">
          Filter by class, search by keyword, or switch to exchange-only listings to find
          second-hand textbooks faster.
        </p>
      </section>

      <section className="border-t border-[#1A1A1A] pt-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
              Categories
            </p>
            <h2 className="mt-3 font-heading text-[2.6rem] leading-none text-[#1A1A1A]">
              Pick your class
            </h2>
            <p className="mt-3 text-base text-[#6B6B6B]">
              Tap a class to filter instantly, or switch to exchange-only listings.
            </p>
          </div>

          {(search || activeFilter !== "all") && !isLoading ? (
            <button type="button" onClick={clearFilters} className="book-button-light">
              Clear Filters
            </button>
          ) : null}
        </div>

        <div className="hide-scrollbar mt-6 overflow-x-auto px-1 pb-3">
          <div className="flex min-w-max gap-6 pr-4 lg:grid lg:min-w-0 lg:grid-cols-6 lg:gap-6 lg:pr-0 xl:gap-7">
            {CATEGORY_CARD_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => updateFilters(item.value)}
                className={`flex min-h-[9.75rem] min-w-[12.75rem] flex-col justify-between rounded-[1.5rem] border-2 border-[#1A1A1A] px-5 py-6 text-left transition duration-150 book-shadow-sm hover:-translate-y-1 ${item.backgroundClass} ${
                  activeFilter === item.value ? "ring-4 ring-[#1A1A1A]/10" : ""
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4F4A43]">
                  Filter
                </p>
                <div className="flex items-center gap-3">
                  {item.value === "exchange" ? <Repeat2 className="h-5 w-5" /> : null}
                  <p className="font-heading text-[2rem] leading-none text-[#1A1A1A]">
                    {item.label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
              Listings
            </p>
            <h2 className="mt-3 font-heading text-[2.6rem] leading-none text-[#1A1A1A]">
              Fresh listings for students
            </h2>
            <p className="mt-3 text-base text-[#6B6B6B]">
              {search ? `Search: "${search}"` : "Browse the latest second-hand textbooks."}
              {" · "}
              {filterSummary}
            </p>
          </div>

          <p className="text-sm text-[#7A766D]">
            {isLoading
              ? "Loading available books..."
              : `Showing ${books.length} of ${pagination.totalBooks} listings`}
          </p>
        </div>

        {error ? (
          <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-[#FFF1F1] p-6 book-shadow">
            <p className="font-heading text-2xl text-[#1A1A1A]">Failed to load books</p>
            <p className="mt-3 text-sm leading-7 text-[#7A2E2E]">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="book-button-dark mt-5"
            >
              Try Again
            </button>
          </div>
        ) : null}

        {!error && isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {skeletonCards.map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        ) : null}

        {!error && !isLoading && books.length === 0 ? (
          <div className="rounded-[1.5rem] border-2 border-dashed border-[#1A1A1A] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-[#F6F1E6]">
              <SearchX className="h-7 w-7 text-[#1A1A1A]" />
            </div>
            <h3 className="mt-5 font-heading text-3xl text-[#1A1A1A]">
              No books match this search
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#6B6B6B]">
              Try another keyword, switch the class filter, or clear the exchange-only view to
              browse all BookWeb listings.
            </p>
            <button type="button" onClick={clearFilters} className="book-button-light mt-6">
              Reset Filters
            </button>
          </div>
        ) : null}

        {!error && !isLoading && books.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-[#D9D4C7] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#7A766D]">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(Math.max(pagination.currentPage - 1, 1))}
                  disabled={pagination.currentPage === 1}
                  className="book-button-light !px-4 !py-2.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>

                {visiblePages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border-2 px-4 font-heading text-sm font-bold transition ${
                      page === pagination.currentPage
                        ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                        : "border-[#1A1A1A] bg-white text-[#1A1A1A] book-shadow-sm hover:-translate-y-px"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    goToPage(Math.min(pagination.currentPage + 1, pagination.totalPages))
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="book-button-light !px-4 !py-2.5"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}

export default Browse;
