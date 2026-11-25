import { useState } from "react";
import { X, Store, Loader2 } from "lucide-react";
import { createBusiness } from "../services/businessService";

function CreateBusinessModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    contactNumber: "",
    googleReviewUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createBusiness(formData);

      onCreated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create business. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Store size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">Add Business</h2>
              <p className="text-sm text-gray-400">
                Enter your business details.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={22} />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Business Name *
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Cafe"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Category *
            </label>

            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Cafe, Restaurant, Retail"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about your business..."
              rows="3"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Address
            </label>

            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Business address"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Contact Number
            </label>

            <input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="9876543210"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Google Review URL
            </label>

            <input
              type="url"
              name="googleReviewUrl"
              value={formData.googleReviewUrl}
              onChange={handleChange}
              placeholder="https://g.page/r/..."
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}
              {loading ? "Creating..." : "Create Business"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateBusinessModal;