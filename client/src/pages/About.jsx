import {
  BookOpenText,
  CircleHelp,
  MessageCircleMore,
  Repeat2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import amishaPhoto from "../assets/amisha.jpg";
import juhiPhoto from "../assets/juhi.jpg";
import ankitPhoto from "../assets/ankit.jpg";
import analdipPhoto from "../assets/analdip-clean.jpg";
import akashPhoto from "../assets/akash.jpg"

const featureCards = [
  {
    icon: BookOpenText,
    title: "Second-hand first",
    description:
      "BookWeb helps students list used textbooks quickly instead of letting them sit unused after exams.",
    tone: "bg-[#FFF8E1]",
  },
  {
    icon: MessageCircleMore,
    title: "Direct chat flow",
    description:
      "Interested buyers can reach sellers directly, which keeps conversations fast and simple for both sides.",
    tone: "bg-[#E7FBF7]",
  },
  {
    icon: Repeat2,
    title: "Swap-friendly too",
    description:
      "Students can mark listings as exchange-ready and mention which books they want in return.",
    tone: "bg-[#EEF4FF]",
  },
];

const teamMembers = [
  {
    name: "Amisha Kumari",
    photo: amishaPhoto,
    role: "Frontend & UI Design",
    note: "Focused on shaping the student-friendly direction of the project.",
  },
  {
    name: "Juhi Kumari",
    photo: juhiPhoto,
    role: "UI Planning & Content",
    note: "Contributed to the overall experience and presentation of the platform.",
  },
  {
    name: "Akash Kumar",
    photo: akashPhoto,
    role: "Backend & Database",
    note: "Handled database design and API integration for the platform.",
  },
  {
    name: "Ankit K Gupta",
    photo: ankitPhoto,
    role: "Testing & Debugging",
    note: "Ensured the platform works smoothly through proper testing.",
  },
  {
    name: "Analdip Kumar",
    photo: analdipPhoto,
    role: "Documentation & Research",
    note: "Built and strengthened the backend and core functionality.",
  },
];

function About() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="rounded-[2rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#93C5FD] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
            <CircleHelp className="h-4 w-4" />
            About BookWeb
          </span>
          <h1 className="mt-5 font-heading text-[3rem] leading-none text-[#1A1A1A] sm:text-[4rem]">
            A simpler way for students to buy, sell, and swap textbooks.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#55514A]">
            BookWeb is a student-focused platform for buying, selling, and exchanging used
            textbooks. The idea is simple: make books more affordable, keep useful material in
            circulation, and remove unnecessary friction from student-to-student handoffs.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/browse" className="book-button-dark">
              Browse Listings
            </Link>
            <Link to="/upload" className="book-button-light">
              Start Selling
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border-2 border-[#1A1A1A] bg-[#F6F1E6] p-8 book-shadow sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7A766D]">
            Why it matters
          </p>
          <h2 className="mt-3 font-heading text-[2.5rem] leading-none text-[#1A1A1A]">
            Lower costs, less waste, and clearer student-to-student exchange.
          </h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[1.35rem] border-2 border-[#1A1A1A] bg-white p-5">
              <p className="font-heading text-xl text-[#1A1A1A]">Save money</p>
              <p className="mt-2 text-sm leading-7 text-[#5C574F]">
                Students can discover affordable used books instead of buying everything new.
              </p>
            </div>
            <div className="rounded-[1.35rem] border-2 border-[#1A1A1A] bg-white p-5">
              <p className="font-heading text-xl text-[#1A1A1A]">Keep books moving</p>
              <p className="mt-2 text-sm leading-7 text-[#5C574F]">
                One student&apos;s finished semester books can immediately help the next one.
              </p>
            </div>
            <div className="rounded-[1.35rem] border-2 border-[#1A1A1A] bg-white p-5">
              <p className="font-heading text-xl text-[#1A1A1A]">Stay direct</p>
              <p className="mt-2 text-sm leading-7 text-[#5C574F]">
                Sellers and buyers connect directly, which makes negotiation and coordination easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#99E5D4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            How it works
          </span>
          <h2 className="mt-5 font-heading text-[2.7rem] leading-none text-[#1A1A1A]">
            Designed around straightforward student workflows.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#5C574F]">
            The goal is not to complicate the process. It is to help students publish a listing,
            find relevant books, and connect quickly.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {featureCards.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={`rounded-[1.5rem] border-2 border-[#1A1A1A] p-6 book-shadow ${item.tone}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border-2 border-[#1A1A1A] bg-white book-shadow-sm">
                  <Icon className="h-5 w-5 text-[#1A1A1A]" />
                </div>
                <h3 className="mt-5 font-heading text-2xl text-[#1A1A1A]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5C574F]">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border-2 border-[#1A1A1A] bg-white p-8 book-shadow sm:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A] bg-[#F5C842] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] book-shadow-sm">
            <Users className="h-4 w-4" />
            Meet the Team
          </span>
          <h2 className="mt-5 font-heading text-[2.7rem] leading-none text-[#1A1A1A]">
            The people behind BookWeb.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#5C574F]">
            BookWeb was shaped as a practical student project with a simple goal: help books
            reach the next student faster, more affordably, and with less waste.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="rounded-[1.5rem] border-2 border-[#1A1A1A] bg-[#FFFDF8] p-5 book-shadow"
            >
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-52 w-full rounded-[1.2rem] border-2 border-[#1A1A1A] object-cover object-center book-shadow-sm"
                />
              ) : (
                <div className="flex h-52 w-full items-center justify-center rounded-[1.2rem] border-2 border-[#1A1A1A] bg-[#F6F1E6] text-center book-shadow-sm">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#1A1A1A] bg-white font-heading text-2xl text-[#1A1A1A]">
                      {member.name.slice(0, 1)}
                    </div>
                    <p className="mt-4 text-sm font-medium text-[#6B6B6B]">Photo coming soon</p>
                  </div>
                </div>
              )}
              <h3 className="mt-5 font-heading text-2xl text-[#1A1A1A]">{member.name}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7A766D]">
                {member.role}
              </p>
              <p className="mt-3 text-sm leading-7 text-[#5C574F]">{member.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
