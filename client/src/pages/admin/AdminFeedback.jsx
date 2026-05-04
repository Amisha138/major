import { useEffect, useState } from "react";
import { Check, X, Star, CheckCircle2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.get("/api/feedback/admin/pending");
      setFeedbacks(res.data.feedbacks);
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/api/feedback/admin/approve/${id}`);
      toast.success("Approved");
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch {
      toast.error("Error approving");
    }
  };


  const handleReject = async (id) => {
    try {
      await api.delete(`/api/feedback/${id}`);
      toast.success("Rejected");
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch {
      toast.error("Error rejecting");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="max-w-[1000px] mx-auto p-6 space-y-6">
      <h1 className="font-heading text-[2.5rem] text-[#1A1A1A]">
        Feedback Approval
      </h1>

      {feedbacks.length === 0 ? (
        <div className="flex items-center gap-2 text-[#6B6B6B]">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          No pending feedback
        </div>
      ) : (
        <div className="grid gap-5">
          {feedbacks.map((item) => (
            <div
              key={item._id}
              className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-white p-6 book-shadow"
            >
              <p className="text-sm text-[#5C574F]">
                “{item.message}”
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-semibold text-[#1A1A1A]">
                  — {item.name}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(item._id)}
                    className="flex items-center gap-1 rounded-full border-2 border-[#1A1A1A] bg-[#99E5D4] px-4 py-2 text-sm font-semibold"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(item._id)}
                    className="flex items-center gap-1 rounded-full border-2 border-[#1A1A1A] bg-[#FCA5A5] px-4 py-2 text-sm font-semibold"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>


              {item.rating && (
                <div className="mt-3 flex gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#F5C842] text-[#F5C842]"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;