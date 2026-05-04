export const CLASS_OPTIONS = [
  { value: "class 9", label: "Class 9" },
  { value: "class 10", label: "Class 10" },
  { value: "class 11", label: "Class 11" },
  { value: "class 12", label: "Class 12" },
  { value: "diploma", label: "Diploma" },
];

export const CATEGORY_CARD_OPTIONS = [
  { value: "class 9", label: "Class 9", backgroundClass: "bg-[#99E5D4]" },
  { value: "class 10", label: "Class 10", backgroundClass: "bg-[#F5C842]" },
  { value: "class 11", label: "Class 11", backgroundClass: "bg-[#C4B5FD]" },
  { value: "class 12", label: "Class 12", backgroundClass: "bg-[#93C5FD]" },
  { value: "diploma", label: "Diploma", backgroundClass: "bg-[#FDBA74]" },
  { value: "exchange", label: "Exchange", backgroundClass: "bg-[#99E5D4]" },
];

export const NAVBAR_CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  ...CLASS_OPTIONS,
  { value: "exchange", label: "Exchange Only" },
];

export const CONDITION_OPTIONS = [
  { value: "Like New", label: "Like New" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" },
];

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatClassLabel = (value) =>
  CLASS_OPTIONS.find((option) => option.value === value)?.label || value || "Not specified";

export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Recently added";

export const getConditionBadgeClass = (condition) => {
  switch (condition) {
    case "Like New":
      return "border border-[#18794E] bg-[#DCFCE7] text-[#18794E]";
    case "Good":
      return "border border-[#A16207] bg-[#FEF3C7] text-[#A16207]";
    case "Fair":
      return "border border-[#C2410C] bg-[#FFEDD5] text-[#C2410C]";
    case "Poor":
      return "border border-[#B91C1C] bg-[#FEE2E2] text-[#B91C1C]";
    default:
      return "border border-[#1A1A1A] bg-white text-[#1A1A1A]";
  }
};

export const getAvailabilityBadgeClass = (isAvailable) =>
  isAvailable
    ? "border border-[#18794E] bg-[#DCFCE7] text-[#18794E]"
    : "border border-[#6B7280] bg-[#F3F4F6] text-[#4B5563]";

export const getInitials = (value = "") =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "BW";

export const getAvatarToneClass = (seed = "") => {
  const palette = [
    "bg-[#F5C842]",
    "bg-[#99E5D4]",
    "bg-[#C4B5FD]",
    "bg-[#93C5FD]",
    "bg-[#FDBA74]",
  ];
  const hash = Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

export const normalizeWhatsAppNumber = (mobile = "") => mobile.replace(/[^\d]/g, "");

export const buildWhatsAppLink = (book) => {
  const mobile = normalizeWhatsAppNumber(book?.uploader?.mobile || "");
  const bookName = book?.bookname || "your book";

  if (!mobile) {
    return "";
  }

  const message = encodeURIComponent(
    `Hi, I saw your ${bookName} on BookWeb. Is it still available?`,
  );

  return `https://wa.me/${mobile}?text=${message}`;
};

export const buildExchangeWhatsAppLink = (book) => {
  const mobile = normalizeWhatsAppNumber(book?.uploader?.mobile || "");
  const bookName = book?.bookname || "book";

  if (!mobile) {
    return "";
  }

  const message = encodeURIComponent(
    `Hi, I saw your ${bookName} on BookWeb. I'd like to propose an exchange!`,
  );

  return `https://wa.me/${mobile}?text=${message}`;
};

export const buildBookSearchParams = ({
  search = "",
  category = "all",
  openToExchange = false,
  page = 1,
}) => {
  const params = new URLSearchParams();
  const normalizedSearch = search.trim();
  const normalizedCategory = category === "exchange" ? "all" : category;
  const exchangeOnly = openToExchange || category === "exchange";

  if (normalizedSearch) {
    params.set("search", normalizedSearch);
  }

  if (normalizedCategory && normalizedCategory !== "all") {
    params.set("category", normalizedCategory);
  }

  if (exchangeOnly) {
    params.set("openToExchange", "true");
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return params;
};

export const getActiveFilterKey = ({ category = "all", openToExchange = false }) =>
  openToExchange ? "exchange" : category;
