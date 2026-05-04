import { BookOpenText, Repeat2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatClassLabel,
  formatDate,
  formatPrice,
  getAvailabilityBadgeClass,
  getConditionBadgeClass,
} from "../utils/books";

function BookCard({ book, footer = null, showAvailability = false }) {
  if (!book) {
    return null;
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white book-shadow transition-transform duration-150 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EEEAE1]">
        {book.image ? (
          <img
            src={book.image?.[0]}
            alt={book.bookname}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#7A766D]">
            <BookOpenText className="h-12 w-12" />
          </div>
        )}

        {book.openToExchange ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#2DD4BF] px-3 py-1 text-[11px] font-semibold text-white">
            <Repeat2 className="h-3.5 w-3.5" />
            Exchange OK
          </span>
        ) : null}

        {showAvailability ? (
          <span
            className={`absolute right-2 top-2 rounded-full px-3 py-1 text-[11px] font-semibold ${getAvailabilityBadgeClass(book.isAvailable)}`}
          >
            {book.isAvailable ? "Live" : "Hidden"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7A766D]">
              {formatClassLabel(book.bookclass)}
            </p>
            <p className="mt-1 text-xs text-[#8C877C]">{formatDate(book.createdAt)}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getConditionBadgeClass(book.bookCondition)}`}
          >
            {book.bookCondition}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-heading text-[1.45rem] leading-tight text-[#1A1A1A]">
            {book.bookname}
          </h3>
          <p className="text-sm text-[#6B6B6B]">{book.bookauthor}</p>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C877C]">
            Price
          </p>
          <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">{formatPrice(book.bookprice)}</p>
        </div>

        <Link to={`/books/${book._id}`} className="book-button-dark mt-5 w-full !py-3">
          View Details
          <span aria-hidden="true">→</span>
        </Link>

        {footer ? <div className="mt-5 border-t border-[#E8E1D3] pt-4">{footer}</div> : null}
      </div>
    </article>
  );
}

export default BookCard;
