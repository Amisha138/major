import { Link } from "react-router-dom";
import { MessageSquare, BookOpen, Users } from "lucide-react";

function AdminDashboard() {
    return (
        <div className="max-w-[1100px] mx-auto p-6 space-y-8">

            {/* Heading */}
            <div>
                <h1 className="font-heading text-[2.7rem] text-[#1A1A1A]">
                    Admin Dashboard
                </h1>
                <p className="text-[#6B6B6B] mt-2">
                    Manage your platform from here.
                </p>
            </div>


            <div className="grid gap-6 md:grid-cols-3">


                <Link
                    to="/admin/feedback"
                    className="rounded-[1.6rem] border-2 border-[#1A1A1A] bg-[#E7FBF7] p-6 book-shadow hover:-translate-y-1 transition"
                >
                    <MessageSquare className="h-6 w-6" />
                    <h3 className="mt-4 font-heading text-xl">Feedback</h3>
                    <p className="mt-2 text-sm text-[#5C574F]">
                        Approve or reject user feedback.
                    </p>
                </Link>

                <div className="rounded-[1.6rem] border-2 border-[#1A1A1A] bg-[#FFF8E1] p-6 book-shadow opacity-70">
                    <BookOpen className="h-6 w-6" />
                    <h3 className="mt-4 font-heading text-xl">Books</h3>
                    <p className="mt-2 text-sm text-[#5C574F]">
                        Manage listings (coming soon).
                    </p>
                </div>

                {/* Users */}
                <div className="rounded-[1.6rem] border-2 border-[#1A1A1A] bg-[#EEF4FF] p-6 book-shadow opacity-70">
                    <Users className="h-6 w-6" />
                    <h3 className="mt-4 font-heading text-xl">Users</h3>
                    <p className="mt-2 text-sm text-[#5C574F]">
                        Manage users (coming soon).
                    </p>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;