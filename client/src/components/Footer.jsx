import { BookOpenText, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-[#1A1A1A] bg-[#FFFDF8]">
      <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#1A1A1A] bg-[#F5C842] book-shadow-sm">
                <BookOpenText className="h-5 w-5 text-[#1A1A1A]" />
              </span>
              <span className="font-heading text-2xl font-bold text-[#1A1A1A]">
                BookWeb
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#6B6B6B]">
              A student-first marketplace to buy, sell, and exchange textbooks easily.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-heading text-lg text-[#1A1A1A]">Explore</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/browse" className="footer-link">Browse Books</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/upload" className="footer-link">Sell a Book</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <p className="font-heading text-lg text-[#1A1A1A]">Account</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link to="/profile" className="footer-link">Profile</Link>
              <Link to="/mybooks" className="footer-link">My Books</Link>
              <Link to="/login" className="footer-link">Login</Link>
            </div>
          </div>

          {/* Contact / Info */}
          <div>
            <p className="font-heading text-lg text-[#1A1A1A]">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-[#6B6B6B]">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@bookweb.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                India
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[#E8E1D3] pt-6 text-center text-sm text-[#7A766D]">
          © {new Date().getFullYear()} BookWeb. Built for students.
        </div>
      </div>
    </footer>
  );
}

export default Footer;