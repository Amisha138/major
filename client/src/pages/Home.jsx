import { useEffect, useState } from "react";
import { ArrowRight, Backpack, BookOpenText, MessageCircleMore, Repeat2, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../api/axios";
import heroStudents from "../assets/hero-students-hq.webp";
import { buildBookSearchParams, CATEGORY_CARD_OPTIONS } from "../utils/books";

const statItems = (totalBooks) => [
  { value: totalBooks, label: "Live Listings" },
  { value: "5", label: "Categories" },
  { value: "0%", label: "Commission" },
];

const featureCards = [
  {
    icon: BookOpenText,
    title: "Quick listings",
    description: "Upload a textbook, add condition and price, and publish in a few steps.",
    tone: "bg-[#FFF8E1]",
  },
  {
    icon: MessageCircleMore,
    title: "Direct contact",
    description: "Students can connect directly instead of waiting on slow marketplace handoffs.",
    tone: "bg-[#E7FBF7]",
  },
  {
    icon: Repeat2,
    title: "Exchange-ready",
    description: "Swap books too, not just sell them, when another title is more useful.",
    tone: "bg-[#EEF4FF]",
  },
];

const steps = [
  {
    title: "Upload your book",
    desc: "Add title, price, and condition in seconds.",
  },
  {
    title: "Get discovered",
    desc: "Your listing appears instantly for other students.",
  },
  {
    title: "Connect & deal",
    desc: "Chat directly and finalize exchange or sale.",
  },
];

const defaultTestimonials = [
  {
    name: "Riya",
    message: "Saved almost ₹2000 in one semester using BookWeb.",
  },
  {
    name: "Aman",
    message: "Sold all my old books in 2 days. Super easy.",
  },
  {
    name: "Sneha",
    message: "Exchange feature is actually very useful.",
  },
];

function Home() {
  const [totalBooks, setTotalBooks] = useState("...");
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  const [form, setForm] = useState({
    name: "",
    message: "",
    rating: 5,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/feedback", form);
      toast.success("Feedback submitted!");
      setForm({ name: "", message: "", rating: 5 });
    } catch {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchStats = async () => {
      try {
        const response = await api.get("/api/books", {
          params: {
            page: 1,
            limit: 1,
          },
        });

        if (!ignore) {
          setTotalBooks(response.data.data.totalBooks);
        }
      } catch {
        if (!ignore) {
          setTotalBooks("0");
        }
      }
    };

    fetchStats();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/api/feedback");
        const feedbacks = res.data?.data?.feedbacks;

        if (feedbacks && feedbacks.length > 0) {
          setTestimonials(feedbacks);
        }
      } catch {
        setTestimonials(defaultTestimonials);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="max-w-[38rem]">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#99E5D4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
            <Backpack className="h-4 w-4" />
            Built for Students
          </span>

          <h1 className="mt-6 font-heading text-[3.5rem] leading-[0.94] text-[#1A1A1A] sm:text-[4.25rem] lg:text-[5.35rem]">
            <span className="block">Buy &amp; sell</span>
            <span className="mt-2 block sm:mt-3">
              <mark className="hero-highlight">used</mark>
            </span>
            <span className="mt-1 block sm:mt-2">textbooks.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#55514A]">
            Save up to 70% on books from juniors who already cracked the syllabus. Upload
            yours in 30 seconds and connect directly with interested students.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/browse" className="book-button-dark">
              Browse Books
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/upload" className="book-button-light">
              Sell a Book
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-end gap-4 text-[#1A1A1A]">
            {statItems(totalBooks).map((item, index) => (
              <div key={item.label} className="flex items-end gap-4">
                <div>
                  <p className="font-heading text-4xl leading-none">{item.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7A766D]">
                    {item.label}
                  </p>
                </div>
                {index < 2 ? (
                  <span className="pb-6 text-2xl font-bold text-[#7A766D]" aria-hidden="true">
                    —
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:ml-auto">
          <div className="rounded-[2rem] border-2 border-[#1A1A1A] bg-[#C4B5FD] p-4 book-shadow-lg">
            <div className="overflow-hidden rounded-[1.65rem] border-2 border-[#1A1A1A] bg-white">
              <img
                src={heroStudents}
                alt="Students exchanging books outdoors"
                loading="eager"
                decoding="async"
                className="aspect-[4/3] w-full object-cover object-center"
              />
            </div>
          </div>

          <div className="absolute bottom-[-1.25rem] right-[-0.25rem] max-w-[14rem] rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white px-5 py-4 book-shadow">
            <p className="font-heading text-[1.9rem] leading-tight text-[#1A1A1A]">
              ₹400 saved on each book.
            </p>
            <p className="mt-2 text-sm text-[#7A766D]">— Riya, Class 12</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1A1A] pt-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#93C5FD] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
              <BookOpenText className="h-4 w-4" />
              Marketplace Preview
            </span>
            <h2 className="mt-5 font-heading text-[2.6rem] leading-none text-[#1A1A1A]">
              Jump into the right shelf faster.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B6B6B]">
              Browse page par class filters, exchange-only view, and fresh listings sab ek
              jagah milenge.
            </p>
          </div>

          <Link to="/browse" className="book-button-light">
            Open Browse Page
          </Link>
        </div>

        <div className="hide-scrollbar mt-6 overflow-x-auto px-1 pb-3">
          <div className="flex min-w-max gap-6 pr-4 lg:grid lg:min-w-0 lg:grid-cols-6 lg:gap-6 lg:pr-0 xl:gap-7">
            {CATEGORY_CARD_OPTIONS.map((item) => (
              <Link
                key={item.value}
                to={`/browse?${buildBookSearchParams({
                  category: item.value === "exchange" ? "all" : item.value,
                  openToExchange: item.value === "exchange",
                }).toString()}`}
                className={`flex min-h-[9.75rem] min-w-[12.75rem] flex-col justify-between rounded-[1.5rem] border-2 border-[#1A1A1A] px-5 py-6 text-left transition duration-150 book-shadow-sm hover:-translate-y-1 ${item.backgroundClass}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4F4A43]">
                  Explore
                </p>
                <div className="flex items-center gap-3">
                  {item.value === "exchange" ? <Repeat2 className="h-5 w-5" /> : null}
                  <p className="font-heading text-[2rem] leading-none text-[#1A1A1A]">
                    {item.label}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {featureCards.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className={`rounded-[1.6rem] border-2 border-[#1A1A1A] p-6 book-shadow ${item.tone}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border-2 border-[#1A1A1A] bg-white book-shadow-sm">
                <Icon className="h-5 w-5 text-[#1A1A1A]" />
              </div>
              <h3 className="mt-5 font-heading text-2xl text-[#1A1A1A]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5C574F]">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[2rem] border-2 border-[#1A1A1A] bg-[#F6F1E6] p-8 book-shadow sm:p-10">
        <h2 className="font-heading text-[2.5rem] text-[#1A1A1A]">
          How BookWeb works
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow-sm"
            >
              <p className="text-sm font-semibold text-[#7A766D]">Step {i + 1}</p>
              <h3 className="mt-2 font-heading text-xl">{step.title}</h3>
              <p className="mt-2 text-sm text-[#5C574F]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="border-t border-[#1A1A1A] pt-10">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT: Testimonials */}
          <div>
            <h2 className="font-heading text-[2.5rem] text-[#1A1A1A]">
              What students say
            </h2>

            <div className="mt-6 space-y-5">
              {testimonials.map((item, index) => (
                <div
                  key={item._id || index}
                  className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-5 book-shadow"
                >
                  <p className="text-sm text-[#5C574F]">
                    “{item.message || item.text}”
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-semibold text-[#1A1A1A]">
                      — {item.name}
                    </p>

                    {item.rating && (
                      <div className="flex gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-[#F5C842] text-[#F5C842]"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: FORM + CTA */}
          <div className="rounded-[2rem] border-2 border-[#1A1A1A] bg-[#F5C842] p-6 sm:p-8 book-shadow">

            <h2 className="font-heading text-[2.3rem] text-[#1A1A1A] leading-tight">
              Share your experience
            </h2>

            <p className="mt-2 text-sm text-[#5C574F]">
              Help others & start saving more.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border-2 border-[#1A1A1A] px-4 py-3 bg-white"
                required
              />

              <textarea
                rows="3"
                placeholder="Your feedback..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border-2 border-[#1A1A1A] px-4 py-3 bg-white"
                required
              />

              {/* ⭐ CLICKABLE STARS */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, rating: r })}
                  >
                    <Star
                      className={`h-6 w-6 ${form.rating >= r
                          ? "fill-[#1A1A1A] text-[#1A1A1A]"
                          : "text-[#1A1A1A]"
                        }`}
                    />
                  </button>
                ))}
              </div>

              <button className="w-full book-button-dark justify-center">
                Submit Feedback
              </button>
            </form>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/browse" className="book-button-dark justify-center">
                Browse Books
              </Link>
              <Link to="/upload" className="book-button-light justify-center">
                Sell Your Book
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
