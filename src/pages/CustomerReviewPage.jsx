import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Sparkles,
  Heart,
  Copy,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Store,
  RefreshCw,
} from "lucide-react";

import { getReviewSuggestions } from "../services/reviewService";

const cardColors = [
  "bg-[#FFF0E8]",
  "bg-[#F2EDFF]",
  "bg-[#FFF9DE]",
  "bg-[#EAF5FF]",
  "bg-[#FFF0F5]",
];

const emojis = ["🌸", "💜", "☀️", "🦋", "🌷"];

function CustomerReviewPage() {
  const { qrCode } = useParams();

  const [business, setBusiness] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");

  const [selectedReview, setSelectedReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copyError, setCopyError] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch suggestions using QR UUID
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!qrCode) {
        setError("QR code is missing. Please scan the business QR again.");
        setLoading(false);
        return;
      }

      try {
        const data = await getReviewSuggestions(qrCode);

        setBusiness(data.businessName);
        setSuggestions(
          Array.isArray(data.suggestions) ? data.suggestions : []
        );
        setGoogleReviewUrl(data.googleReviewUrl || "");

        if (!data.suggestions?.length) {
          setError("No review suggestions are available right now.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load review suggestions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [qrCode]);

  // Copy selected review and redirect to Google
  const handleCopyAndContinue = async () => {
    if (!selectedReview) return;

    setCopyError("");

    try {
      let copiedSuccessfully = false;

      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(selectedReview);
        copiedSuccessfully = true;
      } else {
        // Fallback for HTTP/mobile testing
        const textArea = document.createElement("textarea");

        textArea.value = selectedReview;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.select();

        copiedSuccessfully = document.execCommand("copy");

        document.body.removeChild(textArea);
      }

      if (!copiedSuccessfully) {
        throw new Error("Clipboard copy failed");
      }

      setCopied(true);

      if (!googleReviewUrl) {
        setCopyError(
          "Review copied, but this business has not configured its Google Review link."
        );
        return;
      }

      setTimeout(() => {
        window.location.assign(googleReviewUrl);
      }, 700);
    } catch (err) {
      console.error("Clipboard Error:", err);
      setCopyError("Unable to copy review. Please try again.");
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFCF7]">
        <div className="mb-5 rounded-3xl bg-[#7557D9] p-5 text-white">
          <Sparkles size={35} />
        </div>

        <div className="mb-3 animate-spin text-[#7557D9]">
          <RefreshCw size={25} />
        </div>

        <h2 className="text-xl font-extrabold">
          Preparing something special!
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Generating your review suggestions...
        </p>
      </div>
    );
  }

  // API error screen
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFCF7] px-6 text-center">
        <div className="mb-5 rounded-3xl bg-[#FFF0E8] p-5 text-3xl">
          😕
        </div>

        <h2 className="text-2xl font-extrabold">
          Oops! Something went wrong.
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
          {error}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-2xl bg-[#7557D9] px-6 py-3 font-bold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFFCF7] text-[#29243B]">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#FDE6D9] opacity-60 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-[#E9DEFF] opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#FFF1BD] opacity-50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-7 sm:px-8">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7557D9] text-white shadow-lg shadow-purple-200">
              <Sparkles size={21} />
            </div>

            <span className="text-xl font-extrabold tracking-tight">
              SmartReview<span className="text-[#7557D9]">.</span>
            </span>
          </div>

          <div className="rounded-full border border-purple-100 bg-white/80 px-4 py-2 text-xs font-semibold text-[#7557D9]">
            Made with ✨
          </div>
        </header>

        {/* Business Details */}
        <section className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#FFB88C] to-[#FF8F9C] text-white shadow-xl shadow-orange-100">
            <Store size={35} />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#EDE7FF] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#7557D9]">
            <Sparkles size={13} />
            Your experience matters
          </div>

          <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {business}
          </h1>

          <p className="text-sm font-medium text-gray-500">
            Share your experience with us
          </p>
        </section>

        {/* Welcome Message */}
        <section className="mb-8 text-center">
          <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">
            Your experience matters! 💛
          </h2>

          <p className="mx-auto max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Pick a review that reflects your experience and share your
            thoughts with us.
          </p>
        </section>

        {/* Suggestions Heading */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Choose your favourite</h3>

            <p className="mt-1 text-xs text-gray-500">
              {suggestions.length} suggestions made just for you
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-[#FFF1D8] px-3 py-2 text-xs font-bold text-[#B7791F]">
            <Sparkles size={13} />
            AI Powered
          </div>
        </div>

        {/* AI Suggestions */}
        <section className="space-y-4">
          {suggestions.map((review, index) => {
            const isSelected = selectedReview === review;

            return (
              <button
                key={index}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedReview(review);
                  setCopied(false);
                  setCopyError("");
                }}
                className={`w-full rounded-3xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
                  cardColors[index % cardColors.length]
                } ${
                  isSelected
                    ? "border-[#7557D9] shadow-lg shadow-purple-100"
                    : "border-transparent"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {emojis[index % emojis.length]}
                    </span>

                    <span className="text-[10px] font-extrabold tracking-widest text-gray-500">
                      SUGGESTION {index + 1}
                    </span>
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-[#7557D9] bg-[#7557D9] text-white"
                        : "border-gray-300 bg-white/70"
                    }`}
                  >
                    {isSelected && <Check size={15} />}
                  </div>
                </div>

                <p className="text-sm font-medium leading-7 text-[#393449] sm:text-base">
                  {review}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#7557D9]">
                  {isSelected ? "Selected" : "Select this review"}
                  <ArrowUpRight size={14} />
                </div>
              </button>
            );
          })}
        </section>

        {/* Continue Button */}
        <section className="mt-8">
          <button
            type="button"
            disabled={!selectedReview || copied}
            onClick={handleCopyAndContinue}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 text-base font-bold text-white shadow-xl transition-all duration-200 ${
              selectedReview && !copied
                ? "bg-gradient-to-r from-[#7557D9] to-[#A16BE8] shadow-purple-200 hover:-translate-y-1"
                : "cursor-not-allowed bg-gray-300 shadow-none"
            }`}
          >
            {copied ? (
              <>
                <Check size={20} />
                Review Copied!
              </>
            ) : (
              <>
                <Copy size={19} />
                Copy & Continue to Google
                <ArrowUpRight size={19} />
              </>
            )}
          </button>

          {copyError && (
            <p className="mt-3 text-center text-sm font-medium text-red-500">
              {copyError}
            </p>
          )}

          <p className="mt-4 text-center text-xs leading-5 text-gray-400">
            Your review will be copied. You can paste it on Google and submit
            it after reviewing.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-gray-100 py-7 text-center">
          <div className="mb-3 flex justify-center gap-5 text-gray-400">
            <div className="flex items-center gap-1 text-xs">
              <ShieldCheck size={15} />
              Your privacy matters
            </div>

            <div className="flex items-center gap-1 text-xs">
              <Heart size={14} />
              Made with love
            </div>
          </div>

          <p className="text-xs font-medium text-gray-400">
            Powered by SmartReview AI
          </p>
        </footer>
      </div>
    </main>
  );
}

export default CustomerReviewPage;