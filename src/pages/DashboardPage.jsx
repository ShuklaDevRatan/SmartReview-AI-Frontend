import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Store,
  Plus,
  MapPin,
  Phone,
  RefreshCw,
  Building2,
  AlertCircle,
  LogOut,
} from "lucide-react";

import { getBusinesses } from "../services/businessService";
import CreateBusinessModal from "../components/CreateBusinessModal";
import { Pencil, Power } from "lucide-react";
import EditBusinessModal from "../components/EditBusinessModal";
import { QrCode } from "lucide-react";
import QRPreviewModal from "../components/QRPreviewModal";
import { updateBusinessStatus } from "../services/businessService";

function DashboardPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [selectedQRBusiness, setSelectedQRBusiness] = useState(null);

  const handleLogout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  window.location.replace("/login");
};

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load businesses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (business) => {
  const newStatus =
    business.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  try {
    setStatusLoading(business.id);

    await updateBusinessStatus(business.id, newStatus);

    await fetchBusinesses();
  } catch (err) {
    alert(
      err.response?.data?.message ||
        "Unable to update business status."
    );
  } finally {
    setStatusLoading(null);
  }
};

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-gray-800">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-100 bg-white p-6 md:block">

        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
            <Store size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold">SmartReview AI</h1>
            <p className="text-xs text-gray-400">Business Dashboard</p>
          </div>
        </div>

        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-purple-50 px-4 py-3 font-semibold text-purple-700">
          <LayoutDashboard size={19} />
          Dashboard
        </div>

        <button
  onClick={() => {
    document.getElementById("my-businesses")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
  className="mt-4 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-500 transition hover:bg-purple-50 hover:text-purple-700"
>
  <Store size={19} />
  My Businesses
</button>

        <div className="absolute bottom-6 left-6 right-6 border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-400">
            SmartReview AI © 2026
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64">

        {/* Navbar */}
        <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-6 md:px-10">

          <div>
            <h2 className="text-xl font-bold">Dashboard</h2>
            <p className="text-sm text-gray-400">
              Manage your businesses and reviews
            </p>
          </div>

          <button
  onClick={handleLogout}
  className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
>
  <LogOut size={18} />
  Logout
</button>

        </header>

        {/* Dashboard Body */}
        <section className="p-6 md:p-10">

          {/* Welcome Section */}
          <div className="mb-9">
            <h2 className="text-2xl font-bold md:text-3xl">
              Welcome to SmartReview AI
            </h2>

            <p className="mt-2 text-gray-500">
              Manage your businesses and grow your online reputation.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Total Businesses
                </p>

                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                  <Building2 size={21} />
                </div>
              </div>

              <h3 className="mt-4 text-3xl font-bold">
                {loading ? "..." : businesses.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  Active Businesses
                </p>

                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                  <Store size={21} />
                </div>
              </div>

              <h3 className="mt-4 text-3xl font-bold">
                {loading
                  ? "..."
                  : businesses.filter(
                      (business) => business.status === "ACTIVE"
                    ).length}
              </h3>
            </div>

          </div>

          {/* Business Listing Header */}
<div
  id="my-businesses"
  className="mb-6 scroll-mt-8 flex flex-wrap items-center justify-between gap-4"
>
            <div>
              <h3 className="text-xl font-bold">My Businesses</h3>
              <p className="mt-1 text-sm text-gray-400">
                All your registered businesses in one place.
              </p>
            </div>

            <button
              onClick={fetchBusinesses}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
  onClick={() => setShowCreateModal(true)}
  className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
>
  <Plus size={18} />
  Add Business
</button>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
              <RefreshCw className="mx-auto animate-spin text-purple-600" size={30} />

              <p className="mt-4 text-gray-500">
                Loading your businesses...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">

              <AlertCircle className="mx-auto text-red-500" size={30} />

              <p className="mt-3 font-medium text-red-600">{error}</p>

              <button
                onClick={fetchBusinesses}
                className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Empty State */}
          {!loading && !error && businesses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                <Store size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No businesses yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
                You haven't added any businesses yet. Create your first business to get started.
              </p>

            </div>
          )}

          {/* Business Cards */}
          {!loading && !error && businesses.length > 0 && (

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

              {businesses.map((business) => (

                <div
                  key={business.id}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                        <Store size={23} />
                      </div>

                      <div>
                        <h4 className="font-bold">
                          {business.name}
                        </h4>

                        <p className="mt-1 text-sm text-gray-400">
                          {business.category}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        business.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {business.status}
                    </span>

                  </div>

                  <p className="mt-5 line-clamp-2 text-sm text-gray-500">
                    {business.description || "No description available."}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">

                    {business.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        {business.address}
                      </div>
                    )}

                    {business.contactNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={16} />
                        {business.contactNumber}
                      </div>
                    )}

                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

  <p className="text-xs text-gray-400">
    Business ID: #{business.id}
  </p>

  <div className="flex gap-2">

    <button
      onClick={() => setSelectedBusiness(business)}
      className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
    >
      <Pencil size={15} />
      Edit
    </button>

    <button
      onClick={() => handleStatusChange(business)}
      disabled={statusLoading === business.id}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 ${
        business.status === "ACTIVE"
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-green-50 text-green-600 hover:bg-green-100"
      }`}
    >
      <Power size={15} />

      {statusLoading === business.id
        ? "Updating..."
        : business.status === "ACTIVE"
          ? "Deactivate"
          : "Activate"}
    </button>
    <button
  onClick={() => setSelectedQRBusiness(business)}
  className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
>
  <QrCode size={15} />
  View QR
</button>

  </div>
</div>

                </div>

              ))}

            </div>

          )}

        </section>
        {showCreateModal && (
  <CreateBusinessModal
    onClose={() => setShowCreateModal(false)}
    onCreated={fetchBusinesses}
  />
  
)}
{selectedBusiness && (
  <EditBusinessModal
    business={selectedBusiness}
    onClose={() => setSelectedBusiness(null)}
    onUpdated={fetchBusinesses}
  />
)}

{selectedQRBusiness && (
  <QRPreviewModal
    business={selectedQRBusiness}
    onClose={() => setSelectedQRBusiness(null)}
  />
)}
      </main>
    </div>
  );
}


export default DashboardPage;