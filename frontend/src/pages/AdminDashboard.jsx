import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ArchiveBoxXMark } from "../components/Icons/ArchiveBoxXMark";
import { PencilSquare } from "../components/Icons/PencilSquare";

const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("messages");

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [technologies, setTechnologies] = useState([]);
  const [loadingTechnologies, setLoadingTechnologies] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projectForm, setProjectForm] = useState({
    id: null,
    title: "",
    description: "",
    overview_image: null,
    github_link: "",
    live_link: "",
    featured: false,
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    projectId: null,
  });

  // Technology Modal States
  const [techModal, setTechModal] = useState({
    open: false,
    isEdit: false,
    techId: null,
  });
  const [techForm, setTechForm] = useState({ name: "" });
  const [isSubmittingTech, setIsSubmittingTech] = useState(false);
  const [deleteTechModal, setDeleteTechModal] = useState({
    open: false,
    techId: null,
  });

  // Project Images Modal States
  const [imageModal, setImageModal] = useState({
    open: false,
    projectId: null,
  });
  const [projectImages, setProjectImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Project Technologies Modal States
  const [projectTechModal, setProjectTechModal] = useState({
    open: false,
    projectId: null,
  });
  const [projectTechnologies, setProjectTechnologies] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [loadingProjectTechs, setLoadingProjectTechs] = useState(false);
  const [selectedTechIds, setSelectedTechIds] = useState([]);

  // State untuk table project images dan project technologies
  const [allProjectImages, setAllProjectImages] = useState([]);
  const [allProjectTechnologies, setAllProjectTechnologies] = useState([]);
  const [loadingProjectImages, setLoadingProjectImages] = useState(false);
  const [loadingProjectTechnologies, setLoadingProjectTechnologies] =
    useState(false);

  // Fetch Messages
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
            msg.name?.toLowerCase().includes(filter.toLowerCase()) ||
            msg.email?.toLowerCase().includes(filter.toLowerCase()) ||
            msg.phone?.toLowerCase().includes(filter.toLowerCase()) ||
            msg.message?.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
  }, [filter, messages]);

  // Fetch Projects
  useEffect(() => {
    fetchProjects();
  }, []);
  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      setProjects(data.data || []);
    } catch {
      toast.error("Gagal mengambil projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Technologies
  useEffect(() => {
    fetchTechnologies();
  }, []);

  // Fetch data untuk tabel project images dan project technologies
  useEffect(() => {
    if (currentView === "project-images") {
      fetchAllProjectImages();
    } else if (currentView === "project-technologies") {
      fetchAllProjectTechnologies();
    }
  }, [currentView]);

  const fetchAllProjectImages = async () => {
    setLoadingProjectImages(true);
    try {
      const res = await fetch("http://localhost:5000/api/project-images");
      const data = await res.json();
      setAllProjectImages(data.data || []);
    } catch {
      toast.error("Gagal mengambil project images");
    } finally {
      setLoadingProjectImages(false);
    }
  };

  const fetchAllProjectTechnologies = async () => {
    setLoadingProjectTechnologies(true);
    try {
      const res = await fetch("http://localhost:5000/api/project-technologies");
      const data = await res.json();
      setAllProjectTechnologies(data.data || []);
    } catch {
      toast.error("Gagal mengambil project technologies");
    } finally {
      setLoadingProjectTechnologies(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const openAddModal = () => {
    setProjectForm({
      id: null,
      title: "",
      description: "",
      overview_image: null,
      github_link: "",
      live_link: "",
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      description: project.description,
      overview_image: null,
      github_link: project.github_link,
      live_link: project.live_link,
      featured: !!project.featured,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", projectForm.title);
    formData.append("description", projectForm.description);
    formData.append("github_link", projectForm.github_link);
    formData.append("live_link", projectForm.live_link);
    formData.append("featured", projectForm.featured);
    if (projectForm.overview_image) {
      formData.append("overview_image", projectForm.overview_image);
    }

    const url = projectForm.id
      ? `http://localhost:5000/api/projects/${projectForm.id}`
      : "http://localhost:5000/api/projects";
    const method = projectForm.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (data.success) {
        toast.success(`Project ${projectForm.id ? "updated" : "created"}!`);
        fetchProjects();
        closeModal();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteModal({ open: true, projectId: id });
  };
  const closeDeleteModal = () => {
    setDeleteModal({ open: false, projectId: null });
  };

  const handleDeleteProject = async () => {
    if (!deleteModal.projectId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${deleteModal.projectId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Project berhasil dihapus");
        fetchProjects();
      } else {
        toast.error(data.message || "Gagal menghapus project");
      }
    } catch {
      toast.error("Gagal menghapus project");
    } finally {
      closeDeleteModal();
    }
  };

  // Technology Modal Functions
  const openAddTechModal = () => {
    setTechForm({ name: "" });
    setTechModal({ open: true, isEdit: false, techId: null });
  };

  const openEditTechModal = (tech) => {
    setTechForm({ name: tech.name });
    setTechModal({ open: true, isEdit: true, techId: tech.id });
  };

  const closeTechModal = () => {
    setTechModal({ open: false, isEdit: false, techId: null });
    setTechForm({ name: "" });
  };

  const fetchTechnologies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/technologies");
      const data = await res.json();
      setTechnologies(data.data || []);
    } catch {
      toast.error("Gagal mengambil technologies");
    } finally {
      setLoadingTechnologies(false);
    }
  };

  const handleTechSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingTech(true);

    const url = techModal.isEdit
      ? `http://localhost:5000/api/technologies/${techModal.techId}`
      : "http://localhost:5000/api/technologies";
    const method = techModal.isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: techForm.name }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          techModal.isEdit
            ? "Technology berhasil diupdate"
            : "Technology berhasil ditambahkan"
        );
        fetchTechnologies();
        closeTechModal();
      } else {
        toast.error(data.message || "Gagal menyimpan technology");
      }
    } catch {
      toast.error("Gagal menyimpan technology");
    } finally {
      setIsSubmittingTech(false);
    }
  };

  const openDeleteTechModal = (id) => {
    setDeleteTechModal({ open: true, techId: id });
  };
  const closeDeleteTechModal = () => {
    setDeleteTechModal({ open: false, techId: null });
  };

  const handleDeleteTech = async () => {
    if (!deleteTechModal.techId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/technologies/${deleteTechModal.techId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Technology berhasil dihapus");
        fetchTechnologies();
      } else {
        toast.error(data.message || "Gagal menghapus technology");
      }
    } catch {
      toast.error("Gagal menghapus technology");
    } finally {
      closeDeleteTechModal();
    }
  };

  // Project Images Functions
  const openImageModal = async (projectId) => {
    setImageModal({ open: true, projectId });
    setLoadingImages(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}`
      );
      const data = await res.json();
      if (data.success && data.data.images) {
        setProjectImages(JSON.parse(data.data.images || "[]"));
      }
    } catch {
      toast.error("Gagal mengambil images");
    } finally {
      setLoadingImages(false);
    }
  };

  const closeImageModal = () => {
    setImageModal({ open: false, projectId: null });
    setProjectImages([]);
    setSelectedImages([]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImages.length) {
      toast.error("Pilih gambar terlebih dahulu");
      return;
    }

    if (!imageModal.projectId) {
      toast.error("Pilih project terlebih dahulu");
      return;
    }

    setUploadingImages(true);
    const formData = new FormData();
    Array.from(selectedImages).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${imageModal.projectId}/images`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Images berhasil diupload");
        if (currentView === "project-images") {
          fetchAllProjectImages(); // Refresh table if we're in table view
        }
        openImageModal(imageModal.projectId); // Refresh images in modal
        setSelectedImages([]);
      } else {
        toast.error(data.message || "Gagal upload images");
      }
    } catch {
      toast.error("Gagal upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  // Project Technologies Functions
  const openProjectTechModal = async (projectId) => {
    setProjectTechModal({ open: true, projectId });
    setLoadingProjectTechs(true);
    try {
      const [projectTechRes, techRes] = await Promise.all([
        fetch(`http://localhost:5000/api/projects/${projectId}/technologies`),
        fetch("http://localhost:5000/api/technologies"),
      ]);

      const [projectTechData, techData] = await Promise.all([
        projectTechRes.json(),
        techRes.json(),
      ]);

      // Get current project technologies
      if (projectTechData.success) {
        const currentTechIds = projectTechData.data.map(
          (tech) => tech.technology_id
        );
        setSelectedTechIds(currentTechIds);

        const currentTechNames = projectTechData.data.map(
          (tech) => tech.technology_name
        );
        setProjectTechnologies(currentTechNames);
      } else {
        setSelectedTechIds([]);
        setProjectTechnologies([]);
      }

      if (techData.success) {
        setAvailableTechs(techData.data || []);
      }
    } catch {
      toast.error("Gagal mengambil data");
    } finally {
      setLoadingProjectTechs(false);
    }
  };

  const closeProjectTechModal = () => {
    setProjectTechModal({ open: false, projectId: null });
    setProjectTechnologies([]);
    setAvailableTechs([]);
    setSelectedTechIds([]);
  };

  const handleTechSelection = (techId) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId]
    );
  };

  const saveProjectTechnologies = async () => {
    try {
      // Note: You might need to create an endpoint for this in your backend
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectTechModal.projectId}/technologies`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ technologyIds: selectedTechIds }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Technologies berhasil diupdate");
        fetchProjects(); // Refresh projects
        if (currentView === "project-technologies") {
          fetchAllProjectTechnologies(); // Refresh table if we're in table view
        }
        closeProjectTechModal();
      } else {
        toast.error(data.message || "Gagal update technologies");
      }
    } catch {
      toast.error("Gagal update technologies");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <main className="flex-1 p-4 md:p-8 w-full">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-10 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-purple-800">
            Dashboard
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentView("messages")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentView === "messages"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setCurrentView("projects")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentView === "projects"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              Manage Projects
            </button>
            <button
              onClick={() => setCurrentView("technologies")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentView === "technologies"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              Manage Technologies
            </button>
            <button
              onClick={() => setCurrentView("project-images")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentView === "project-images"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              Project Images
            </button>
            <button
              onClick={() => setCurrentView("project-technologies")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentView === "project-technologies"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              Project Technologies
            </button>
          </div>
        </header>

        {currentView === "messages" && (
          <>
            <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Cari pesan..."
                className="border border-purple-200 rounded-lg px-3 py-2 w-full md:w-64 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                onClick={() => setFilter("")}
                disabled={!filter}
              >
                Reset
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-100 text-xs md:text-sm">
                <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                  <tr>
                    <th className="py-3 px-6">#</th>
                    <th className="py-3 px-6">Nama</th>
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">WhatsApp</th>
                    <th className="py-3 px-6">Pesan</th>
                    <th className="py-3 px-6">Hari</th>
                    <th className="py-3 px-6">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {filteredMessages.map((msg, idx) => (
                    <tr key={msg.id} className="hover:bg-purple-50/40">
                      <td className="py-2 px-6">{idx + 1}</td>
                      <td className="py-2 px-6">{msg.name}</td>
                      <td className="py-2 px-6">{msg.email}</td>
                      <td className="py-2 px-6">{msg.phone}</td>
                      <td className="py-2 px-6">{msg.message}</td>
                      <td className="py-2 px-6">
                        {days[new Date(msg.createdAt).getDay()]}
                      </td>
                      <td className="py-2 px-6">{formatDate(msg.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {currentView === "projects" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-800">Projects</h2>
              <button
                onClick={openAddModal}
                className="bg-purple-600 text-white px-4 py-2 rounded text-sm"
              >
                + Add Project
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-100 text-xs md:text-sm">
                <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                  <tr>
                    <th className="py-3 px-6">#</th>
                    <th className="py-3 px-6">Image</th>
                    <th className="py-3 px-6">Title</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Github</th>
                    <th className="py-3 px-6">Live</th>
                    <th className="py-3 px-6">Featured</th>
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 text-center">
                  {projects.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-purple-50/40">
                      <td className="py-2 px-6">{idx + 1}</td>
                      <td className="py-2 px-6">
                        {p.overview_image ? (
                          <img
                            src={`http://localhost:5000/uploads/${p.overview_image}`}
                            alt={p.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="py-2 px-6">{p.title}</td>
                      <td className="py-2 px-6">{p.description}</td>
                      <td className="py-2 px-6">{p.github_link}</td>
                      <td className="py-2 px-6">{p.live_link}</td>
                      <td className="py-2 px-6">{p.featured ? "Yes" : "No"}</td>
                      <td className="py-2 px-6">
                        <div className="flex justify-center gap-1 flex-wrap">
                          <button
                            onClick={() => openEditModal(p)}
                            className="text-blue-600 text-xs hover:underline"
                            title="Edit Project"
                          >
                            <PencilSquare className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openImageModal(p.id)}
                            className="text-green-600 text-xs hover:underline"
                            title="Manage Images"
                          >
                            📷
                          </button>
                          <button
                            onClick={() => openProjectTechModal(p.id)}
                            className="text-purple-600 text-xs hover:underline"
                            title="Manage Technologies"
                          >
                            ⚙️
                          </button>
                          <button
                            onClick={() => openDeleteModal(p.id)}
                            className="text-red-600 text-xs hover:underline"
                            title="Delete Project"
                          >
                            <ArchiveBoxXMark className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {currentView === "technologies" && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
              <h2 className="text-xl font-bold text-purple-800">
                Technologies
              </h2>
              <button
                onClick={openAddTechModal}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
              >
                Tambah Technology
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-x-auto">
              {loadingTechnologies ? (
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
              ) : technologies.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-lg">
                  Tidak ada technology ditemukan.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-purple-100 text-xs md:text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <tr>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        #
                      </th>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        Name
                      </th>
                      <th className="py-3 px-6 text-center font-semibold text-purple-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {technologies.map((tech, idx) => (
                      <tr
                        key={tech.id}
                        className="hover:bg-purple-50/40 transition"
                      >
                        <td className="py-2 px-6 text-gray-500">{idx + 1}</td>
                        <td className="py-2 px-6 font-medium text-gray-900">
                          {tech.name}
                        </td>
                        <td className="py-2 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditTechModal(tech)}
                              className="text-blue-600 text-xs hover:underline mr-2"
                            >
                              <PencilSquare className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteTechModal(tech.id)}
                              className="text-red-600 text-xs hover:underline"
                            >
                              <ArchiveBoxXMark className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Project Images Table View */}
        {currentView === "project-images" && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
              <h2 className="text-xl font-bold text-purple-800">
                Project Images
              </h2>
              <button
                onClick={() => setImageModal({ open: true, projectId: null })}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
              >
                Add Project Image
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-x-auto">
              {loadingProjectImages ? (
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
              ) : allProjectImages.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-lg">
                  Tidak ada project images ditemukan.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-purple-100 text-xs md:text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <tr>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        #
                      </th>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        Project Title
                      </th>
                      <th className="py-3 px-6 text-center font-semibold text-purple-700">
                        Image Preview
                      </th>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        Image Path
                      </th>
                      <th className="py-3 px-6 text-center font-semibold text-purple-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {allProjectImages.map((img, idx) => (
                      <tr
                        key={`${img.project_id}-${img.image_path}`}
                        className="hover:bg-purple-50/40 transition"
                      >
                        <td className="py-2 px-6 text-gray-500">{idx + 1}</td>
                        <td className="py-2 px-6 font-medium text-gray-900">
                          {img.project_title}
                        </td>
                        <td className="py-2 px-6 text-center">
                          <img
                            src={`http://localhost:5000/uploads/${img.image_path}`}
                            alt={img.project_title}
                            className="w-16 h-16 object-cover rounded mx-auto"
                          />
                        </td>
                        <td className="py-2 px-6 text-gray-600 text-xs">
                          {img.image_path}
                        </td>
                        <td className="py-2 px-6 text-center">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `http://localhost:5000/api/projects/${img.project_id}/images/${img.image_path}`,
                                  { method: "DELETE" }
                                );
                                const data = await res.json();
                                if (data.success) {
                                  toast.success("Image berhasil dihapus");
                                  fetchAllProjectImages();
                                } else {
                                  toast.error(
                                    data.message || "Gagal hapus image"
                                  );
                                }
                              } catch {
                                toast.error("Gagal hapus image");
                              }
                            }}
                            className="text-red-600 text-xs hover:underline"
                            title="Delete Image"
                          >
                            <ArchiveBoxXMark className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Project Technologies Table View */}
        {currentView === "project-technologies" && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
              <h2 className="text-xl font-bold text-purple-800">
                Project Technologies
              </h2>
              <button
                onClick={() =>
                  setProjectTechModal({ open: true, projectId: null })
                }
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition text-sm"
              >
                Add Project Technology
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-x-auto">
              {loadingProjectTechnologies ? (
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
              ) : allProjectTechnologies.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-lg">
                  Tidak ada project technologies ditemukan.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-purple-100 text-xs md:text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <tr>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        #
                      </th>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        Project Title
                      </th>
                      <th className="py-3 px-6 text-left font-semibold text-purple-700">
                        Technology Name
                      </th>
                      <th className="py-3 px-6 text-center font-semibold text-purple-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {allProjectTechnologies.map((pt, idx) => (
                      <tr
                        key={`${pt.project_id}-${pt.technology_id}`}
                        className="hover:bg-purple-50/40 transition"
                      >
                        <td className="py-2 px-6 text-gray-500">{idx + 1}</td>
                        <td className="py-2 px-6 font-medium text-gray-900">
                          {pt.project_title}
                        </td>
                        <td className="py-2 px-6 text-gray-700">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            {pt.technology_name}
                          </span>
                        </td>
                        <td className="py-2 px-6 text-center">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `http://localhost:5000/api/project-technologies/${pt.project_id}/${pt.technology_id}`,
                                  { method: "DELETE" }
                                );
                                const data = await res.json();
                                if (data.success) {
                                  toast.success(
                                    "Technology assignment berhasil dihapus"
                                  );
                                  fetchAllProjectTechnologies();
                                } else {
                                  toast.error(
                                    data.message || "Gagal hapus assignment"
                                  );
                                }
                              } catch {
                                toast.error("Gagal hapus assignment");
                              }
                            }}
                            className="text-red-600 text-xs hover:underline"
                            title="Remove Technology from Project"
                          >
                            <ArchiveBoxXMark className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg">
              <h3 className="text-lg font-bold mb-4">
                {projectForm.id ? "Edit Project" : "Add Project"}
              </h3>
              <form
                onSubmit={handleProjectSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <input
                  type="text"
                  placeholder="Title"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, title: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      overview_image: e.target.files[0],
                    })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Github Link"
                  value={projectForm.github_link}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      github_link: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Live Link"
                  value={projectForm.live_link}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      live_link: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        featured: e.target.checked,
                      })
                    }
                  />{" "}
                  Featured
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal konfirmasi hapus */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Konfirmasi Hapus Project
              </h3>
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus project ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={closeDeleteModal}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold"
                  onClick={handleDeleteProject}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Add/Edit Technology */}
        {techModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {techModal.isEdit ? "Edit Technology" : "Tambah Technology"}
              </h3>
              <form onSubmit={handleTechSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Technology
                  </label>
                  <input
                    type="text"
                    value={techForm.name}
                    onChange={(e) => setTechForm({ name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan nama technology..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                    onClick={closeTechModal}
                    disabled={isSubmittingTech}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                    disabled={isSubmittingTech}
                  >
                    {isSubmittingTech
                      ? "Menyimpan..."
                      : techModal.isEdit
                      ? "Update"
                      : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal konfirmasi hapus technology */}
        {deleteTechModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Konfirmasi Hapus Technology
              </h3>
              <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus technology ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                  onClick={closeDeleteTechModal}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold"
                  onClick={handleDeleteTech}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Project Images */}
        {imageModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {imageModal.projectId
                  ? "Manage Project Images"
                  : "Add Project Images"}
              </h3>

              {/* Project Selection for Add Mode */}
              {!imageModal.projectId && (
                <div className="mb-6 p-4 border rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project
                  </label>
                  <select
                    value={imageModal.projectId || ""}
                    onChange={(e) =>
                      setImageModal({
                        ...imageModal,
                        projectId: e.target.value || null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Upload Form */}
              {imageModal.projectId && (
                <form
                  onSubmit={handleImageUpload}
                  className="mb-6 p-4 border rounded-lg"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedImages(e.target.files)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      type="submit"
                      disabled={uploadingImages || !selectedImages.length}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      {uploadingImages ? "Uploading..." : "Upload Images"}
                    </button>
                  </div>
                </form>
              )}

              {/* Images Grid - Only show if we have a specific project selected */}
              {imageModal.projectId && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Current Images</h4>
                  {loadingImages ? (
                    <div className="text-center py-8">Loading images...</div>
                  ) : projectImages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No images found
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {projectImages.map((imagePath, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={`http://localhost:5000/uploads/${imagePath}`}
                            alt={`Project image ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `http://localhost:5000/api/projects/${imageModal.projectId}/images/${imagePath}`,
                                  {
                                    method: "DELETE",
                                  }
                                );
                                const data = await res.json();
                                if (data.success) {
                                  toast.success("Image berhasil dihapus");
                                  openImageModal(imageModal.projectId); // Refresh images
                                } else {
                                  toast.error(
                                    data.message || "Gagal hapus image"
                                  );
                                }
                              } catch {
                                toast.error("Gagal hapus image");
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={closeImageModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Project Technologies */}
        {projectTechModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {projectTechModal.projectId
                  ? "Manage Project Technologies"
                  : "Add Project Technologies"}
              </h3>

              {/* Project Selection for Add Mode */}
              {!projectTechModal.projectId && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Project
                  </label>
                  <select
                    value={projectTechModal.projectId || ""}
                    onChange={(e) => {
                      const projectId = e.target.value || null;
                      setProjectTechModal({ ...projectTechModal, projectId });
                      if (projectId) {
                        // Load data for the selected project
                        openProjectTechModal(projectId);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {loadingProjectTechs ? (
                <div className="text-center py-8">Loading...</div>
              ) : projectTechModal.projectId ? (
                <>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Current Technologies:{" "}
                      {projectTechnologies.length > 0
                        ? projectTechnologies.join(", ")
                        : "None"}
                    </h4>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Technologies ({selectedTechIds.length} selected)
                    </label>
                    <div className="max-h-60 overflow-y-auto border rounded-lg p-3">
                      {availableTechs.map((tech) => (
                        <label
                          key={tech.id}
                          className="flex items-center gap-2 py-1 hover:bg-gray-50 rounded px-2"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTechIds.includes(tech.id)}
                            onChange={() => handleTechSelection(tech.id)}
                            className="rounded"
                          />
                          <span
                            className={`text-sm ${
                              selectedTechIds.includes(tech.id)
                                ? "font-medium text-purple-700"
                                : ""
                            }`}
                          >
                            {tech.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={closeProjectTechModal}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        saveProjectTechnologies();
                        // Refresh the table data after saving
                        if (currentView === "project-technologies") {
                          fetchAllProjectTechnologies();
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Save Technologies
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Please select a project first
                </div>
              )}

              {/* Close button for when no project is selected */}
              {!projectTechModal.projectId && (
                <div className="flex justify-end">
                  <button
                    onClick={closeProjectTechModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
