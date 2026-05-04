import { Repeat2 } from "lucide-react";
import { buildExchangeWhatsAppLink } from "../utils/books";

function ExchangeBox({ book }) {
  if (!book?.openToExchange) {
    return null;
  }

  const exchangeLink = buildExchangeWhatsAppLink(book);

  return (
    <div className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
        Exchange
      </p>
      <h3 className="mt-3 font-heading text-2xl text-[#1A1A1A]">Open to Exchange</h3>
      <p className="mt-3 text-sm leading-7 text-[#55514A]">
        Looking for: {book.wantedBooks || "Open to similar textbooks and exam guides."}
      </p>

      <a
        href={exchangeLink || undefined}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => {
          if (!exchangeLink) {
            event.preventDefault();
          }
        }}
        className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#1A1A1A] px-4 py-3 font-heading text-sm font-bold text-white transition ${
          exchangeLink ? "bg-[#2DD4BF] book-shadow hover:-translate-y-px" : "bg-[#9DDDD2] opacity-70"
        }`}
      >
        <Repeat2 className="h-4 w-4" />
        Propose Exchange on WhatsApp
      </a>
    </div>
  );
}

export default ExchangeBox;
