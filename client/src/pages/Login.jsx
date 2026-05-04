import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { KeyRound, MessageCircleMore, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading your session..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({
        identifier: identifier.trim(),
        password,
      });

      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="space-y-5 rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#99E5D4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
          <ShieldCheck className="h-4 w-4" />
          Secure login
        </span>
        <h1 className="font-heading text-[3.2rem] leading-none text-[#1A1A1A] sm:text-[4rem]">
          Pick up where your listings left off.
        </h1>
        <p className="max-w-xl text-base leading-7 text-[#5C574F]">
          Sign in with your email or mobile number and keep chatting with buyers directly on
          WhatsApp without any extra middle layer.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.35rem] border-2 border-[#1A1A1A] bg-[#F6F1E6] p-5">
            <MessageCircleMore className="h-5 w-5 text-[#1A1A1A]" />
            <p className="mt-3 font-heading text-xl text-[#1A1A1A]">Fast replies</p>
            <p className="mt-2 text-sm leading-6 text-[#5C574F]">
              Jump back into buyer chats and exchange proposals quickly.
            </p>
          </div>
          <div className="rounded-[1.35rem] border-2 border-[#1A1A1A] bg-[#FFF8E1] p-5">
            <KeyRound className="h-5 w-5 text-[#1A1A1A]" />
            <p className="mt-3 font-heading text-xl text-[#1A1A1A]">Cookie auth</p>
            <p className="mt-2 text-sm leading-6 text-[#5C574F]">
              Sessions stay secure with httpOnly cookies and no local token storage.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">Login</p>
        <h2 className="mt-3 font-heading text-[2.7rem] leading-none text-[#1A1A1A]">
          Welcome back
        </h2>
        <p className="mt-3 text-sm text-[#6B6B6B]">
          Enter your details to manage listings, profile updates, and messages.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="identifier">
              Email or Mobile
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="book-input"
              placeholder="Enter your email or mobile number"
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="book-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error ? (
            <p className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFF1F1] px-4 py-3 text-sm text-[#9F2F2F]">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="book-button-dark w-full">
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#6B6B6B]">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-[#1A1A1A] underline" to="/register">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
