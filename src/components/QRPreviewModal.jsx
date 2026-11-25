import { useEffect, useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { getBusinessQR } from "../services/businessService";

function QRPreviewModal({ business, onClose }) {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let objectUrl;

    const fetchQR = async () => {
      try {
        const blob = await getBusinessQR(business.id);
        objectUrl = URL.createObjectURL(blob);
        setQrUrl(objectUrl);
      } catch (err) {
        setError("Unable to load QR code.");
      } finally {
        setLoading(false);
      }
    };

    fetchQR();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [business.id]);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `business-${business.id}-qr.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Business QR Code</h2>
            <p className="text-sm text-gray-400">{business.name}</p>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 p-6">

          {loading && (
            <Loader2 className="animate-spin text-purple-600" size={32} />
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {qrUrl && (
            <img
              src={qrUrl}
              alt="Business QR Code"
              className="h-64 w-64 object-contain"
            />
          )}

        </div>

        <p className="my-4 text-center text-sm text-gray-500">
          Scan this QR code to open your business review page.
        </p>

        <button
          onClick={downloadQR}
          disabled={!qrUrl}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          <Download size={18} />
          Download QR
        </button>

      </div>
    </div>
  );
}

export default QRPreviewModal;