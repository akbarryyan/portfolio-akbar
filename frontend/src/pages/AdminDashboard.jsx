import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        toast.error("Gagal mengambil pesan");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!filter) {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(
        messages.filter(
          (msg) =>
            (msg.name &&
              msg.name.toLowerCase().includes(filter.toLowerCase())) ||
            (msg.email &&
              msg.email.toLowerCase().includes(filter.toLowerCase())) ||
            (msg.phone &&
              msg.phone.toLowerCase().includes(filter.toLowerCase())) ||
            (msg.message &&
              msg.message.toLowerCase().includes(filter.toLowerCase()))
        )
      );
    }
  }, [filter, messages]);

  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-10 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800 drop-shadow">
            Dashboard
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm md:text-base">
              Total Pesan: {filteredMessages.length}
            </span>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm md:text-base">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: undefined,
                month: undefined,
                day: undefined,
              })}
            </span>
          </div>
        </header>
        {/* Filter Button & Input */}
        <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari nama, email, WhatsApp, atau pesan..."
            className="border border-purple-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 w-full md:w-64 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
            onClick={() => setFilter("")}
            disabled={!filter}
          >
            Reset Filter
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <svg
                className="animate-spin h-8 w-8 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-lg">
              Tidak ada pesan ditemukan.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="max-h-[60vh] min-w-[600px] overflow-y-auto">
                <table className="min-w-full divide-y divide-purple-100 text-xs md:text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <tr>
                      <th className="py-3 md:py-4 px-2 md:px-6 text-left font-semibold text-purple-700 whitespace-nowrap">
                        #
                      </th>
                      <th className="py-3 md:py-4 px-2 md:px-6 text-left font-semibold text-purple-700 whitespace-nowrap">
                        Nama
                      </th>
                      <th className="py-3 md:py-4 px-2 md:px-6 text-left font-semibold text-purple-700 whitespace-nowrap">
                        Email
                      </th>
                      <th className="py-3 md:py-4 px-2 md:px-6 text-left font-semibold text-purple-700 whitespace-nowrap">
                        WhatsApp
                      </th>
                      <th className="py-3 md:py-4 px-2 md:px-6 text-left font-semibold text-purple-700 whitespace-nowrap">
                        Pesan
                      </th>
                      <th className="py-3 md:py-4 px-2 md:px-6 text-left font-semibold text-purple-700 whitespace-nowrap">
                        Hari
                      </th>
                      <th className="py-3 md:py-4 px-2 md:px-6 text-left font-semibold text-purple-700 whitespace-nowrap">
                        Tanggal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {filteredMessages.map((msg, idx) => {
                      let day = "-";
                      if (msg.createdAt) {
                        const dateObj = new Date(msg.createdAt);
                        day = days[dateObj.getDay()];
                      }
                      return (
                        <tr
                          key={msg.id}
                          className="hover:bg-purple-50/40 transition"
                        >
                          <td className="py-2 md:py-3 px-2 md:px-6 text-gray-500 text-center">
                            {idx + 1}
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-6 font-medium text-gray-900 max-w-[120px] md:max-w-xs truncate">
                            {msg.name}
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-6 text-blue-700 underline max-w-[140px] md:max-w-xs truncate">
                            {msg.email}
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-6 text-green-700 max-w-[100px] md:max-w-xs truncate">
                            {msg.phone}
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-6 text-gray-700 max-w-[180px] md:max-w-xs break-words truncate">
                            {msg.message}
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-6 text-xs text-purple-700 font-bold text-center">
                            {day}
                          </td>
                          <td className="py-2 md:py-3 px-2 md:px-6 text-xs text-gray-600 text-center">
                            {formatDate(msg.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
