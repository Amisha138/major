import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BookCopy,
  CheckCircle2,
  Copy,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import ExchangeBox from "../components/ExchangeBox";
import { useAuth } from "../context/AuthContext";
import {
  buildWhatsAppLink,
  formatClassLabel,
  formatPrice,
  getAvatarToneClass,
  getAvailabilityBadgeClass,
  getConditionBadgeClass,
  getInitials,
} from "../utils/books";
import { getErrorMessage } from "../utils/errors";

function BookDetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[2rem] border-2 border-[#1A1A1A] bg-[#C4B5FD] p-4 book-shadow-lg">
        <div className="aspect-[4/4.5] animate-pulse rounded-[1.6rem] bg-white/70" />
      </div>

      <div className="space-y-5">
        <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow">
          <div className="h-4 w-24 animate-pulse rounded-full bg-[#ECE7DA]" />
          <div className="mt-4 h-14 w-3/4 animate-pulse rounded-[1rem] bg-[#ECE7DA]" />
          <div className="mt-3 h-6 w-1/2 animate-pulse rounded-full bg-[#ECE7DA]" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, index) => index).map((item) => (
              <div key={item} className="rounded-[1.25rem] border border-[#E8E1D3] p-4">
                <div className="h-3 w-14 animate-pulse rounded-full bg-[#ECE7DA]" />
                <div className="mt-3 h-6 w-3/4 animate-pulse rounded-full bg-[#ECE7DA]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow">
          <div className="h-4 w-28 animate-pulse rounded-full bg-[#ECE7DA]" />
          <div className="mt-4 h-24 animate-pulse rounded-[1rem] bg-[#ECE7DA]" />
        </div>

        <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow">
          <div className="h-4 w-20 animate-pulse rounded-full bg-[#ECE7DA]" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-[1rem] bg-[#ECE7DA]" />
          <div className="mt-3 h-12 w-full animate-pulse rounded-[1rem] bg-[#ECE7DA]" />
        </div>
      </div>
    </div>
  );
}

function DetailCell({ label, value, highlight = false }) {
  return (
    <div className="rounded-[1.25rem] border border-[#E8E1D3] bg-[#FFFDF8] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
        {label}
      </p>
      <div
        className={`mt-2 ${highlight ? "font-heading text-[1.9rem] leading-none text-[#1A1A1A]" : "text-base font-semibold text-[#1A1A1A]"}`}
      >
        {value}
      </div>
    </div>
  );
}

function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchBook = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get(`/api/books/${id}`);

        if (!ignore) {
          setBook(response.data.data.book);
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

    fetchBook();

    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  useEffect(() => {
    if (book?.image?.length) {
      setActiveImage(0);
    }
  }, [book]);

  const isOwner = useMemo(
    () => Boolean(user?._id && book?.uploader?._id && user._id === book.uploader._id),
    [book?.uploader?._id, user?._id],
  );

  const handleCopyMobile = async () => {
    if (!book?.uploader?.mobile) {
      toast.error("Seller mobile number is not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(book.uploader.mobile);
      toast.success("Seller mobile copied");
    } catch {
      toast.error("Could not copy the number right now");
    }
  };

  const handleMarkUnavailable = async () => {
    setIsUpdatingAvailability(true);

    try {
      const response = await api.patch(`/api/books/${id}/unavailable`);
      setBook(response.data.data.book);
      toast.success("Book marked as unavailable");
    } catch (requestError) {
      toast.error(getErrorMessage(requestError));
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (error || !book) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border-2 border-[#1A1A1A] bg-white p-8 text-center book-shadow">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
          Book detail
        </p>
        <h1 className="mt-4 font-heading text-4xl text-[#1A1A1A]">
          This listing could not be opened
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#6B6B6B]">
          {error || "The requested book is not available right now."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setReloadKey((value) => value + 1)}
            className="book-button-dark"
          >
            Try Again
          </button>
          <Link to="/" className="book-button-light">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  const whatsappLink = buildWhatsAppLink(book);
  const emailLink = book.uploader?.email ? `mailto:${book.uploader.email}` : "";
  const sellerAvatarTone = getAvatarToneClass(book.uploader?.name || "");

  return (
    <section className="space-y-6">
      {!book.isAvailable ? (
        <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-[#FEF3C7] px-5 py-4 text-sm text-[#8A5B08] book-shadow-sm">
          This book has been marked unavailable by the seller, so it no longer appears in the
          public browse grid.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border-2 border-[#1A1A1A] bg-[#C4B5FD] p-4 book-shadow-lg">
          <div className="relative overflow-hidden rounded-[1.65rem] border-2 border-[#1A1A1A] bg-white">
            <div className="aspect-[4/4.5] bg-[#EEEAE1]">
              {book.image && book.image.length > 0 ? (
                <img
                  src={book.image[activeImage]}
                  alt={book.bookname}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#7A766D]">
                  <BookCopy className="h-16 w-16" />
                </div>
              )}

              {book.image?.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {book.image.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setActiveImage(i)}
                      className={`h-16 w-16 object-cover rounded-lg border-2 cursor-pointer ${activeImage === i ? "border-black" : "border-[#1A1A1A]"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#F6F1E6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A766D]">
                {formatClassLabel(book.bookclass)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getAvailabilityBadgeClass(book.isAvailable)}`}
              >
                {book.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            <h1 className="mt-4 font-heading text-[2.9rem] leading-none text-[#1A1A1A] sm:text-[3.4rem]">
              {book.bookname}
            </h1>
            <p className="mt-3 text-lg text-[#6B6B6B]">by {book.bookauthor}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailCell label="Price" value={formatPrice(book.bookprice)} highlight />
              <DetailCell
                label="Condition"
                value={
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getConditionBadgeClass(book.bookCondition)}`}
                  >
                    {book.bookCondition}
                  </span>
                }
              />
              <DetailCell label="Class" value={formatClassLabel(book.bookclass)} />
              <DetailCell label="Language" value={book.booklanguage || "Not specified"} />
              <DetailCell label="Publication" value={book.bookpublication || "Not specified"} />
              <DetailCell
                label="Volume"
                value={book.bookvolume ? `Volume ${book.bookvolume}` : "Not specified"}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
              Description
            </p>
            <p className="mt-4 text-sm leading-7 text-[#55514A]">
              {book.description || "No extra description was shared for this listing."}
            </p>
          </div>

          <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
              Seller
            </p>

            <div className="mt-4 flex items-center gap-4">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-[#1A1A1A] ${sellerAvatarTone}`}
              >
                {getInitials(book.uploader?.name || "BookWeb")}
              </span>
              <div>
                <p className="font-heading text-2xl text-[#1A1A1A]">
                  {book.uploader?.name || "Unknown seller"}
                </p>
                <p className="text-sm text-[#6B6B6B]">{book.uploader?.email || "No email shared"}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <a
                href={whatsappLink || undefined}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  if (!whatsappLink || !book.isAvailable) {
                    event.preventDefault();
                  }
                }}
                className={`book-button-dark w-full !py-3 ${!whatsappLink || !book.isAvailable ? "pointer-events-none opacity-60" : ""
                  }`}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Seller
              </a>

              <button
                type="button"
                onClick={handleCopyMobile}
                className="book-button-light w-full !justify-center !px-3 !py-3"
              >
                <Phone className="h-4 w-4" />
                <span className="truncate">{book.uploader?.mobile || "No phone"}</span>
                <Copy className="h-4 w-4" />
              </button>

              <a
                href={emailLink || undefined}
                onClick={(event) => {
                  if (!emailLink) {
                    event.preventDefault();
                  }
                }}
                className={`book-button-light w-full !py-3 ${!emailLink ? "pointer-events-none opacity-60" : ""
                  }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>

            {isOwner ? (
              <button
                type="button"
                onClick={handleMarkUnavailable}
                disabled={!book.isAvailable || isUpdatingAvailability}
                className="book-button-light mt-4 w-full !justify-center !bg-[#FEF3C7]"
              >
                <CheckCircle2 className="h-4 w-4" />
                {book.isAvailable
                  ? isUpdatingAvailability
                    ? "Updating..."
                    : "Mark as Unavailable"
                  : "Already Unavailable"}
              </button>
            ) : null}
          </div>

          <ExchangeBox book={book} />
        </div>
      </div>
    </section>
  );
}

export default BookDetail;
