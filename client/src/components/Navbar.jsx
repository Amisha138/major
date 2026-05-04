import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  BookOpenText,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  buildBookSearchParams,
  getInitials,
  NAVBAR_CATEGORY_OPTIONS,
} from "../utils/books";
import { getErrorMessage } from "../utils/errors";

const mobileLinks = [
  { to: "/", label: "Home", isPublic: true },
  { to: "/browse", label: "Browse", isPublic: true },
  { to: "/about", label: "About", isPublic: true },
  { to: "/upload", label: "Sell a Book", guestTo: "/login" },
  { to: "/mybooks", label: "My Books" },
  { to: "/profile", label: "Profile" },
];

function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const isAboutPage = location.pathname === "/about";
  const isBrowsePage = location.pathname === "/browse";

  const searchValue = searchParams.get("search") || "";
  const categoryValue = useMemo(() => {
    if (searchParams.get("openToExchange") === "true") {
      return "exchange";
    }

    return searchParams.get("category") || "all";
  }, [searchParams]);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const goToBrowsePage = () => {
    closeMenus();
    navigate("/browse");
  };

  const submitSearch = (nextSearch, nextCategoryValue) => {
    const isExchangeSearch = nextCategoryValue === "exchange";

    const params = buildBookSearchParams({
      search: nextSearch,
      category: isExchangeSearch ? "all" : nextCategoryValue,
      openToExchange: isExchangeSearch,
      page: 1,
    });

    navigate({
      pathname: "/browse",
      search: params.toString() ? `?${params.toString()}` : "",
    });

    closeMenus();
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    submitSearch(
      String(formData.get("search") || ""),
      String(formData.get("category") || "all"),
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      closeMenus();
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const desktopNavLinkClass = (isActive) =>
    `inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
      ? "border-2 border-[#1A1A1A] bg-[#F6F1E6] text-[#1A1A1A] book-shadow-sm"
      : "text-[#4F4A43] hover:bg-[#F6F1E6]"
    }`;

  const searchForm = (
    mobile = false,
  ) => (
    <form
      key={`${mobile ? "mobile" : "desktop"}-${location.pathname}-${location.search}`}
      onSubmit={handleSearchSubmit}
      className={`flex ${mobile ? "flex-col gap-3" : "items-center gap-0"}`}
    >
      <div className="flex w-full overflow-hidden rounded-full border-2 border-[#1A1A1A] bg-white book-shadow-sm">
        <label className="relative flex min-w-0 flex-1 items-center">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
          <input
            type="search"
            name="search"
            defaultValue={searchValue}
            placeholder="Search books, authors..."
            className="h-13 w-full min-w-0 border-0 bg-transparent py-3 pl-11 pr-4 text-sm text-[#1A1A1A] outline-none placeholder:text-[#9A958A]"
          />
        </label>

        <div className="relative border-l-2 border-[#1A1A1A]">
          <select
            name="category"
            defaultValue={categoryValue}
            className="h-13 min-w-[108px] appearance-none border-0 bg-white px-4 pr-9 text-sm font-medium text-[#1A1A1A] outline-none"
          >
            {NAVBAR_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
        </div>

        <button
          type="submit"
          aria-label="Search books"
          className="inline-flex h-13 w-13 items-center justify-center border-l-2 border-[#1A1A1A] bg-[#F5C842] text-[#1A1A1A] transition hover:bg-[#F1C12A]"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#D9D4C7] bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-[1320px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#1A1A1A] bg-[#F5C842] text-[#1A1A1A] book-shadow-sm">
              <BookOpenText className="h-5 w-5" />
            </span>
            <span className="font-heading text-[1.9rem] font-bold leading-none text-[#1A1A1A]">
              BookWeb
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <button
              type="button"
              onClick={goToBrowsePage}
              className={desktopNavLinkClass(isBrowsePage)}
            >
              Browse
            </button>
            <Link to="/about" className={desktopNavLinkClass(isAboutPage)}>
              About
            </Link>
          </nav>

          <div className="hidden min-w-0 flex-1 lg:flex lg:justify-center">{searchForm()}</div>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link to="/upload" className="book-button-light">
                  <Upload className="h-4 w-4" />
                  Sell a Book
                </Link>

                {user?.isAdmin && (
                  <Link to="/admin" className="book-button-light">
                    Admin
                  </Link>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((currentValue) => !currentValue)}
                    className="inline-flex items-center gap-3 rounded-full border-2 border-[#1A1A1A] bg-white px-3 py-2 text-sm font-semibold text-[#1A1A1A] book-shadow-sm"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C4B5FD] text-sm font-bold text-[#1A1A1A]">
                      {getInitials(user.name)}
                    </span>
                    <span className="max-w-[9rem] truncate">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isAccountMenuOpen ? (
                    <div className="absolute right-0 top-[calc(100%+0.8rem)] w-56 rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-2 book-shadow">
                      <Link
                        to="/mybooks"
                        onClick={closeMenus}
                        className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#1A1A1A] transition hover:bg-[#F6F1E6]"
                      >
                        My Books
                      </Link>
                      <Link
                        to="/profile"
                        onClick={closeMenus}
                        className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#1A1A1A] transition hover:bg-[#F6F1E6]"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium text-[#B91C1C] transition hover:bg-[#FDEDED]"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <Link to="/login" className="book-button-dark px-6">
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
            className="ml-auto inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] book-shadow-sm lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-4 rounded-[1.75rem] border-2 border-[#1A1A1A] bg-[#FFFDF8] p-4 book-shadow lg:hidden">
            {searchForm(true)}

            <div className="mt-4 grid gap-2">
              {mobileLinks
                .filter((item) => item.isPublic || user || item.guestTo)
                .map((item) => (
                  <Link
                    key={item.to}
                    to={user ? item.to : item.guestTo || item.to}
                    onClick={closeMenus}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-[#1A1A1A] transition hover:bg-[#F6F1E6]"
                  >
                    {item.label}
                  </Link>
                ))}
            </div>

            <div className="mt-4 border-t border-[#E8E1D3] pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C4B5FD] text-sm font-bold text-[#1A1A1A]">
                      {getInitials(user.name)}
                    </span>
                    <div>
                      <p className="font-heading text-lg text-[#1A1A1A]">{user.name}</p>
                      <p className="text-sm text-[#6B6B6B]">{user.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="book-button-light w-full !justify-start !px-4"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={closeMenus} className="book-button-dark w-full">
                  <UserRound className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
