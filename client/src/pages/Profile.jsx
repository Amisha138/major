import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Camera, Mail, Phone, UserRound } from "lucide-react";
import api from "../api/axios";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { getAvatarToneClass, getInitials } from "../utils/books";
import { getErrorMessage } from "../utils/errors";

function Profile() {
  const { loading, updateUser, user } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(() => ({
    name: user?.name || "",
    mobile: user?.mobile || "",
  }));
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const currentImage = useMemo(
    () => previewUrl || user?.profilePic || "",
    [previewUrl, user?.profilePic],
  );

  const hasChanges =
    formData.name.trim() !== (user?.name || "") ||
    formData.mobile.trim() !== (user?.mobile || "") ||
    Boolean(selectedFile);

  const avatarTone = getAvatarToneClass(user?.name || "");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be 5MB or smaller");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!hasChanges) {
      toast("No profile changes to save");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("mobile", formData.mobile.trim());

      if (selectedFile) {
        payload.append("profilePic", selectedFile);
      }

      const response = await api.patch("/api/users/profile", payload);
      updateUser(response.data.data.user);
      setSelectedFile(null);
      setPreviewUrl("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Profile updated successfully");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader label="Loading your profile..." />
      </div>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
          Your profile
        </p>
        <div className="mt-6 flex flex-col items-center text-center">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="relative">
            {currentImage ? (
              <img
                src={currentImage}
                alt={user.name}
                className="h-28 w-28 rounded-full border-2 border-[#1A1A1A] object-cover book-shadow-sm"
              />
            ) : (
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#1A1A1A] text-3xl font-bold text-[#1A1A1A] book-shadow-sm ${avatarTone}`}
              >
                {getInitials(user.name)}
              </div>
            )}
            <span className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-white">
              <Camera className="h-4 w-4 text-[#1A1A1A]" />
            </span>
          </button>

          <h1 className="mt-5 font-heading text-4xl text-[#1A1A1A]">{user.name}</h1>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Keep your contact details current so students can reach you faster.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <div className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFFDF8] px-4 py-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#1A1A1A]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A766D]">
                  Email
                </p>
                <p className="mt-1 text-sm text-[#1A1A1A]">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFFDF8] px-4 py-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#1A1A1A]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A766D]">
                  Mobile
                </p>
                <p className="mt-1 text-sm text-[#1A1A1A]">{user.mobile}</p>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleProfilePicChange(event.target.files?.[0])}
        />
      </div>

      <div className="rounded-[1.75rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
          Edit details
        </p>
        <h2 className="mt-3 font-heading text-[2.7rem] leading-none text-[#1A1A1A]">
          Update public contact info
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#6B6B6B]">
          Buyers and exchange partners will use this information after opening your listing.
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
              placeholder="Your display name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1A1A1A]" htmlFor="email">
              Email
            </label>
            <div className="book-input flex items-center gap-3 !bg-[#FFFDF8] text-sm text-[#6B6B6B]">
              <UserRound className="h-4 w-4 text-[#7A766D]" />
              <span>{user.email}</span>
            </div>
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
              placeholder="Your active contact number"
              required
            />
          </div>

          {selectedFile ? (
            <p className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFF8E1] px-4 py-3 text-sm text-[#5C574F]">
              New profile image selected: {selectedFile.name}
            </p>
          ) : null}

          {error ? (
            <p className="rounded-[1.25rem] border-2 border-[#1A1A1A] bg-[#FFF1F1] px-4 py-3 text-sm text-[#9F2F2F]">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="book-button-light flex-1"
            >
              Change Profile Picture
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="book-button-dark flex-1"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Profile;
