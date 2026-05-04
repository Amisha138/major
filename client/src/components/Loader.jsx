function Loader({ label = "Loading...", className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border-2 border-[#1A1A1A] bg-white px-4 py-3 text-sm font-medium text-[#1A1A1A] book-shadow-sm ${className}`.trim()}
    >
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-[#F5C842]" />
      <span>{label}</span>
    </div>
  );
}

export default Loader;
