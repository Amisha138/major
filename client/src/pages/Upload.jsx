import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { ImagePlus, Repeat2, UploadCloud, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { CLASS_OPTIONS, CONDITION_OPTIONS } from "../utils/books";
import { getErrorMessage } from "../utils/errors";

const initialFormData = {
  bookname: "",
  bookauthor: "",
  bookpublication: "",
  booklanguage: "English",
  bookvolume: "",
  bookprice: "",
  bookclass: "",
  bookCondition: "",
  description: "",
  openToExchange: false,
  wantedBooks: "",
};

function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [previewUrl, setPreviewUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(
  //   () => () => {
  //     if (previewUrl) {
  //       URL.revokeObjectURL(previewUrl);
  //     }
  //   },
  //   [],
  // );

  const resetImage = () => {
    // if (previewUrl) {
    //   URL.revokeObjectURL(previewUrl);
    // }

    setSelectedFiles([]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const setImageFiles = (files) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only images allowed");
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Max 5MB per image");
        return false;
      }

      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleToggleExchange = () => {
    setFormData((currentData) => ({
      ...currentData,
      openToExchange: !currentData.openToExchange,
      wantedBooks: currentData.openToExchange ? "" : currentData.wantedBooks,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (selectedFiles.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    if (formData.openToExchange && !formData.wantedBooks.trim()) {
      setError("Add the books you would like in exchange");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      selectedFiles.forEach((file) => {
        payload.append("images", file);
      });

      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          payload.append(key, String(value));
          return;
        }

        if (value !== "") {
          payload.append(key, value);
        }
      });

      await api.post("/api/books", payload);
      toast.success("Book uploaded successfully");
      navigate("/mybooks");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#F5C842] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
          <UploadCloud className="h-4 w-4" />
          Upload
        </span>
        <h1 className="mt-5 font-heading text-[2.8rem] leading-none text-[#1A1A1A]">
          List a book in under a minute.
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#5C574F]">
          Add one clear image, write a short description, and let students contact you
          directly. Exchange-friendly listings get an extra badge in the grid.
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            setImageFiles(event.dataTransfer.files);
          }}
          className={`mt-8 flex w-full flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed px-6 py-10 text-center transition ${isDragging
            ? "border-[#1A1A1A] bg-[#99E5D4]"
            : "border-[#1A1A1A] bg-[#FFFDF8] hover:bg-[#F9F3E7]"
            }`}
        >
          {selectedFiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {selectedFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  className="h-32 w-full object-cover rounded-xl border"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-white">
                <ImagePlus className="h-7 w-7 text-[#1A1A1A]" />
              </div>
              <p className="mt-5 font-heading text-2xl text-[#1A1A1A]">
                Drag and drop your image here
              </p>
              <p className="mt-2 text-sm text-[#6B6B6B]">
                JPG, PNG, WEBP, or SVG up to 5MB. Click to choose from your device.
              </p>
            </>
          )}
        </button>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={(event) => setImageFiles(event.target.files)}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="book-button-light flex-1"
          >
            Choose Image
          </button>

          {selectedFiles.length > 0 ? (
            <button type="button" onClick={resetImage} className="book-button-light flex-1">
              <X className="h-4 w-4" />
              Remove
            </button>
          ) : null}
        </div>

        {selectedFiles.length > 0 && (
          <p className="mt-4 text-sm text-[#5C574F]">
            {selectedFiles.length} images selected
          </p>
        )}
      </div>

      <div className="rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
          Book details
        </p>
        <h2 className="mt-3 font-heading text-[2.6rem] leading-none text-[#1A1A1A]">
          Create your listing
        </h2>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="bookname">
                Book Name
              </label>
              <input
                id="bookname"
                name="bookname"
                type="text"
                value={formData.bookname}
                onChange={handleChange}
                className="book-input"
                placeholder="Physics Guide"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="bookauthor">
                Author
              </label>
              <input
                id="bookauthor"
                name="bookauthor"
                type="text"
                value={formData.bookauthor}
                onChange={handleChange}
                className="book-input"
                placeholder="R K Sharma"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="bookpublication">
                Publication
              </label>
              <input
                id="bookpublication"
                name="bookpublication"
                type="text"
                value={formData.bookpublication}
                onChange={handleChange}
                className="book-input"
                placeholder="Scholar Press"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="booklanguage">
                Language
              </label>
              <input
                id="booklanguage"
                name="booklanguage"
                type="text"
                value={formData.booklanguage}
                onChange={handleChange}
                className="book-input"
                placeholder="English"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="bookvolume">
                Volume
              </label>
              <input
                id="bookvolume"
                name="bookvolume"
                type="number"
                min="0"
                value={formData.bookvolume}
                onChange={handleChange}
                className="book-input"
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="bookprice">
                Price
              </label>
              <input
                id="bookprice"
                name="bookprice"
                type="number"
                min="0"
                value={formData.bookprice}
                onChange={handleChange}
                className="book-input"
                placeholder="320"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="bookclass">
                Class
              </label>
              <select
                id="bookclass"
                name="bookclass"
                value={formData.bookclass}
                onChange={handleChange}
                className="book-input"
                required
              >
                <option value="">Select a class</option>
                {CLASS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="bookCondition">
                Condition
              </label>
              <select
                id="bookCondition"
                name="bookCondition"
                value={formData.bookCondition}
                onChange={handleChange}
                className="book-input"
                required
              >
                <option value="">Select condition</option>
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="book-input"
                placeholder="Mention markings, notes, binding condition, or if the price is negotiable."
              />
            </div>

            <div className="sm:col-span-2 rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFFDF8] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Open to Exchange?</p>
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    Let buyers know if you want to swap instead of only selling.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.openToExchange}
                  onClick={handleToggleExchange}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full border-2 border-[#1A1A1A] ${formData.openToExchange ? "bg-[#99E5D4]" : "bg-white"
                    } book-shadow-sm`}
                >
                  <span className="sr-only">Toggle exchange option</span>
                  <span className="flex w-full items-center justify-between px-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1A1A1A]">
                    <span>No</span>
                    <span>Yes</span>
                  </span>
                  <span
                    className={`absolute top-1 h-8 w-10 rounded-full border-2 border-[#1A1A1A] bg-[#F5C842] transition-transform duration-200 ${formData.openToExchange ? "translate-x-[2.7rem]" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>

            {formData.openToExchange ? (
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="wantedBooks">
                  What books do you want in exchange?
                </label>
                <textarea
                  id="wantedBooks"
                  name="wantedBooks"
                  rows="4"
                  value={formData.wantedBooks}
                  onChange={handleChange}
                  className="book-input"
                  placeholder="e.g. NCERT Physics Class 12, RS Aggarwal..."
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFF1F1] px-4 py-3 text-sm text-[#9F2F2F]">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="book-button-dark w-full">
            <UploadCloud className="h-4 w-4" />
            {isSubmitting ? "Publishing..." : "Publish Listing"}
          </button>

          <div className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#F6F1E6] p-4 text-sm text-[#5C574F]">
            <p className="flex items-center gap-2 font-heading text-lg text-[#1A1A1A]">
              <Repeat2 className="h-4 w-4" />
              Exchange-ready tip
            </p>
            <p className="mt-2 leading-7">
              Listings marked as exchange-friendly get a teal badge in the book card and an
              extra WhatsApp proposal button on the detail page.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Upload;
