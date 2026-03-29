import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const status = error?.status || 404;
  const is404 = status === 404;

  const message =
    error?.statusText ||
    error?.message ||
    (is404
      ? "The page you're looking for doesn't exist or has been moved."
      : "An unexpected error occurred on our server.");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0805] text-center px-6 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,131,58,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(212,131,58,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(212,131,58,0.07)_0%,transparent_65%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 max-w-xl">

        {/* Status */}
        <h1 className="text-[100px] md:text-[140px] font-bold text-[#d4833a]/20 leading-none">
          {status}
        </h1>

        {/* Label */}
        <p className="uppercase tracking-widest text-xs text-[#c07030] mb-4">
          {is404 ? "Page Not Found" : "Server Error"}
        </p>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {is404 ? (
            <>
              <span className="italic text-[#d4a06a]">Lost</span> in the void
            </>
          ) : (
            <>
              Something <span className="italic text-[#d4a06a]">broke</span>
            </>
          )}
        </h2>

        {/* Divider */}
        <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#d4833a] to-transparent mx-auto mb-6" />

        {/* Message */}
        <p className="text-sm text-white/50 leading-relaxed mb-8">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">

          <Link
            to="/"
            className="px-6 py-3 bg-[#18100a] text-white border border-[#d4833a]/30 rounded-md text-xs uppercase tracking-wider hover:bg-[#d4833a] transition"
          >
            ← Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-[#d4833a]/20 text-white/60 rounded-md text-xs uppercase tracking-wider hover:text-[#d4a06a] hover:border-[#d4833a]/40 transition"
          >
            Go Back
          </button>

        </div>

        {/* Code */}
        <p className="mt-10 text-xs text-white/20 uppercase tracking-widest">
          Error code {status}
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;