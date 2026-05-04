import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import BookDetail from "./pages/BookDetail";
import Browse from "./pages/Browse";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyBooks from "./pages/MyBooks";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFeedback from "./pages/admin/AdminFeedback";

function AppShell() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
      <Navbar />
      <main className="mx-auto w-full max-w-[1240px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/about" element={<About />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/mybooks" element={<MyBooks />} />
            <Route path="/profile" element={<Profile />} />


            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const elementId = location.hash.slice(1);
    const frameId = requestAnimationFrame(() => {
      document.getElementById(elementId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [location.hash, location.pathname]);

  return (
    <ErrorBoundary resetKey={`${location.pathname}${location.search}`}>
      <AppShell />
    </ErrorBoundary>
  );
}

export default App;
