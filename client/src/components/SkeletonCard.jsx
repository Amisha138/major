function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white book-shadow">
      <div className="aspect-[4/3] animate-pulse bg-[#E8E1D3]" />
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-20 animate-pulse rounded-full bg-[#ECE7DA]" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-[#ECE7DA]" />
        </div>
        <div className="h-8 w-4/5 animate-pulse rounded-2xl bg-[#ECE7DA]" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#ECE7DA]" />
        <div className="h-3 w-14 animate-pulse rounded-full bg-[#ECE7DA]" />
        <div className="h-8 w-28 animate-pulse rounded-2xl bg-[#ECE7DA]" />
        <div className="h-12 w-full animate-pulse rounded-full bg-[#ECE7DA]" />
      </div>
    </div>
  );
}

export default SkeletonCard;
