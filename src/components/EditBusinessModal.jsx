import { useState } from "react";
import { X, Store, Loader2 } from "lucide-react";
import { updateBusiness } from "../services/businessService";

function EditBusinessModal({ business, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: business.name || "",
    category: business.category || "",
    description: business.description || "",
    address: business.address || "",
    contactNumber: business.contactNumber || "",
    googleReviewUrl: business.googleReviewUrl || "",
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

      await updateBusiness(business.id, formData);

      await onUpdated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update business. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Store size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">Edit Business</h2>
              <p className="text-sm text-gray-400">
                Update your business details.
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", label: "Business Name", required: true },
            { name: "category", label: "Category", required: true },
            { name: "address", label: "Address" },
            { name: "contactNumber", label: "Contact Number" },
            { name: "googleReviewUrl", label: "Google Review URL" },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-semibold">
                {field.label} {field.required && "*"}
              </label>

              <input
                type={field.name === "googleReviewUrl" ? "url" : "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className={inputClass}
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
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
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBusinessModal;
