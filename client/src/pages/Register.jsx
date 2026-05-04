import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BookOpenText, Repeat2, UserPlus } from "lucide-react";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { loading, register, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading your session..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Confirm password must match your password");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        password: formData.password,
      });

      toast.success("Account created successfully");
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.98fr_1.02fr]">
      <div className="rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
          Register
        </p>
        <h1 className="mt-3 font-heading text-[2.9rem] leading-none text-[#1A1A1A] sm:text-[3.4rem]">
          Create your BookWeb account
        </h1>
        <p className="mt-4 text-base leading-7 text-[#5C574F]">
          Set up your student profile once, then list books, manage exchange offers, and
          update your public contact info anytime.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="book-input"
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="book-input"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="mobile">
                Mobile
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                className="book-input"
                placeholder="10-digit mobile"
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="book-input"
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="book-input"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFF1F1] px-4 py-3 text-sm text-[#9F2F2F]">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="book-button-dark w-full">
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#6B6B6B]">
          Already have an account?{" "}
          <Link className="font-semibold text-[#1A1A1A] underline" to="/login">
            Login here
          </Link>
        </p>
      </div>

      <div className="space-y-5 rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#93C5FD] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
          <UserPlus className="h-4 w-4" />
          Student-ready
        </span>
        <h2 className="font-heading text-[3.1rem] leading-none text-[#1A1A1A] sm:text-[3.7rem]">
          Build once. Sell, swap, and update anytime.
        </h2>
        <p className="max-w-xl text-base leading-7 text-[#5C574F]">
          Your secure profile powers listings, seller contact, and exchange proposals across
          the platform.
        </p>

        <div className="grid gap-4">
          <div className="rounded-[1.35rem] border-2 border-[#1A1A1A] bg-[#F6F1E6] p-5">
            <BookOpenText className="h-5 w-5 text-[#1A1A1A]" />
            <p className="mt-3 font-heading text-xl text-[#1A1A1A]">List textbooks fast</p>
            <p className="mt-2 text-sm leading-6 text-[#5C574F]">
              Publish a clean, mobile-friendly listing with photo, condition, and price.
            </p>
          </div>
          <div className="rounded-[1.35rem] border-2 border-[#1A1A1A] bg-[#E7FBF7] p-5">
            <Repeat2 className="h-5 w-5 text-[#1A1A1A]" />
            <p className="mt-3 font-heading text-xl text-[#1A1A1A]">Offer exchanges too</p>
            <p className="mt-2 text-sm leading-6 text-[#5C574F]">
              Mark books as exchange-friendly and show what you want in return.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
