import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUserEdit, FaSearch, FaEnvelope, FaHeart } from "react-icons/fa";

const steps = [
  {
    num: "01",
    Icon: FaUserEdit,
    title: "Create Your Biodata",
    body: "Register and fill out your personal biodata with details about yourself, your family, and what you're looking for in a life partner.",
    tag: "5 minutes",
  },
  {
    num: "02",
    Icon: FaSearch,
    title: "Browse & Filter",
    body: "Search thousands of verified profiles using filters for age, division, and biodata type to narrow down your ideal match.",
    tag: "At your pace",
  },
  {
    num: "03",
    Icon: FaEnvelope,
    title: "Request Contact Info",
    body: "Found someone promising? Request their contact details through our secure, admin-verified system for just $5.",
    tag: "Admin verified",
  },
  {
    num: "04",
    Icon: FaHeart,
    title: "Begin Your Journey",
    body: "Connect through verified contact details and take the first steps toward a meaningful, lifelong companionship.",
    tag: "The beginning",
  },
];

const Works = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0e0905] px-5 py-16 md:px-8 lg:px-10 lg:py-24"
    >
      {/* Radial glow */}
      <div className="pointer-events-none absolute -right-28 -top-28 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,131,58,0.10)_0%,transparent_65%)]" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(212,131,58,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(212,131,58,0.04)_1px,transparent_1px)] bg-[size:52px_52px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#c07030]">
            <span className="h-px w-7 bg-current opacity-50" />
            How It Works
            <span className="h-px w-7 bg-current opacity-50" />
          </div>

          <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-[#fffcf6] md:text-5xl lg:text-6xl">
            Your Path to a
            <br />
            <span className="italic text-[#d4a06a]">Meaningful</span> Connection
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-[rgba(255,252,246,0.45)] md:text-base">
            A simple four-step process built for sincerity, safety, and transparency —
            from first profile to first conversation.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 grid overflow-hidden rounded-2xl border border-[rgba(212,131,58,0.12)] bg-[rgba(212,131,58,0.12)] grid-cols-1 gap-px sm:grid-cols-2 xl:grid-cols-4"
        >
          {steps.map(({ num, Icon, title, body, tag }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative cursor-default bg-[#0e0905] px-8 py-10 transition duration-300 hover:bg-[#160e07]"
            >
              <div className="mb-6 text-5xl font-bold leading-none tracking-tight text-[rgba(212,131,58,0.12)] transition duration-300 group-hover:text-[rgba(212,131,58,0.22)]">
                {num}
              </div>

              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(212,131,58,0.2)] bg-[rgba(212,131,58,0.1)] text-[#d4833a] transition duration-300 group-hover:border-[rgba(212,131,58,0.4)] group-hover:bg-[rgba(212,131,58,0.18)]">
                <Icon size={18} />
              </div>

              <span className="mb-3 inline-block rounded border border-[rgba(192,112,48,0.25)] bg-[rgba(212,131,58,0.05)] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#c07030]">
                {tag}
              </span>

              <h3 className="mb-3 text-base font-medium leading-snug text-[#fffcf6]">
                {title}
              </h3>

              <p className="text-sm leading-7 text-[rgba(255,252,246,0.4)]">
                {body}
              </p>

              {i !== steps.length - 1 && (
                <span className="absolute bottom-7 right-7 translate-x-[-4px] text-sm text-[rgba(212,131,58,0.3)] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-[rgba(212,131,58,0.6)]">
                  →
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <Link
            to="/signup"
            className="inline-block rounded-md bg-[#d4833a] px-8 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#fffcf6] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c47030] hover:shadow-[0_6px_20px_rgba(212,131,58,0.35)]"
          >
            Create Your Biodata →
          </Link>

          <Link
            to="/biodatapage"
            className="text-xs font-medium uppercase tracking-[0.1em] text-[rgba(255,252,246,0.4)] transition duration-200 hover:text-[#d4a06a]"
          >
            Browse profiles first
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Works;