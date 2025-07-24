import { useState, useEffect } from "react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [pauseAutoSlide, setPauseAutoSlide] = useState({});
  const [isTransitioning, setIsTransitioning] = useState({});
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      // Set initial visible projects based on screen size
      if (projects.length === 0) {
        // Only set on initial load
        setVisibleProjects(mobile ? 3 : 6);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [projects.length]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Auto-slide images every 3 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newIndex = { ...prev };
        projects.forEach((project) => {
          // Only auto-slide if not paused for this project
          if (
            project.allImages &&
            project.allImages.length > 1 &&
            !pauseAutoSlide[project.id]
          ) {
            const currentIndex = newIndex[project.id] || 0;
            newIndex[project.id] =
              (currentIndex + 1) % project.allImages.length;
          }
        });
        return newIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [projects, pauseAutoSlide]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/projects");
      const data = await response.json();

      if (data.success) {
        // Process projects to combine overview_image with project_images
        const processedProjects = data.data.map((project) => {
          const allImages = [];

          // Add overview_image first if exists
          if (project.overview_image) {
            allImages.push({
              path: project.overview_image,
              isOverview: true,
            });
          }

          // Add project_images if exists
          if (project.images) {
            try {
              const projectImages = JSON.parse(project.images);
              if (Array.isArray(projectImages)) {
                projectImages.forEach((imagePath) => {
                  allImages.push({
                    path: imagePath,
                    isOverview: false,
                  });
                });
              }
            } catch (e) {
              // If images is not JSON, treat as comma-separated string
              if (typeof project.images === "string" && project.images.trim()) {
                const imageArray = project.images
                  .split(",")
                  .filter((img) => img.trim());
                imageArray.forEach((imagePath) => {
                  allImages.push({
                    path: imagePath.trim(),
                    isOverview: false,
                  });
                });
              }
            }
          }

          return {
            ...project,
            allImages,
          };
        });

        setProjects(processedProjects);

        // Initialize image indices
        const initialIndices = {};
        processedProjects.forEach((project) => {
          if (project.allImages && project.allImages.length > 0) {
            initialIndices[project.id] = 0;
          }
        });
        setCurrentImageIndex(initialIndices);

        // Set initial visible projects based on screen size
        const mobile = window.innerWidth < 768;
        setVisibleProjects(mobile ? 3 : 6);
        setIsMobile(mobile);
      } else {
        setError("Failed to fetch projects");
      }
    } catch (err) {
      setError("Error fetching projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = (projectId) => {
    // Prevent rapid clicking during transition
    if (isTransitioning[projectId]) return;

    setIsTransitioning((prev) => ({ ...prev, [projectId]: true }));

    setCurrentImageIndex((prev) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project || !project.allImages || project.allImages.length <= 1)
        return prev;

      const currentIndex = prev[projectId] || 0;
      const newIndex =
        currentIndex === 0 ? project.allImages.length - 1 : currentIndex - 1;

      return {
        ...prev,
        [projectId]: newIndex,
      };
    });

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning((prev) => ({ ...prev, [projectId]: false }));
    }, 300);
  };

  const handleNextImage = (projectId) => {
    // Prevent rapid clicking during transition
    if (isTransitioning[projectId]) return;

    setIsTransitioning((prev) => ({ ...prev, [projectId]: true }));

    setCurrentImageIndex((prev) => {
      const project = projects.find((p) => p.id === projectId);
      if (!project || !project.allImages || project.allImages.length <= 1)
        return prev;

      const currentIndex = prev[projectId] || 0;
      const newIndex = (currentIndex + 1) % project.allImages.length;

      return {
        ...prev,
        [projectId]: newIndex,
      };
    });

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning((prev) => ({ ...prev, [projectId]: false }));
    }, 300);
  };

  const handleIndicatorClick = (projectId, imageIndex) => {
    // Prevent clicking during transition
    if (isTransitioning[projectId]) return;

    setIsTransitioning((prev) => ({ ...prev, [projectId]: true }));

    setCurrentImageIndex((prev) => ({
      ...prev,
      [projectId]: imageIndex,
    }));

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning((prev) => ({ ...prev, [projectId]: false }));
    }, 300);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);

    // Store current scroll position
    const currentScrollY = window.scrollY;

    // Simulate loading delay for better UX
    setTimeout(() => {
      const previousCount = visibleProjects;
      // Add more projects based on screen size
      const incrementCount = isMobile ? 3 : 6;
      setVisibleProjects((prev) => prev + incrementCount);
      setLoadingMore(false);

      // Smooth scroll to show new projects after a short delay
      setTimeout(() => {
        // Calculate position of first new project
        const newProjectsSection = document.querySelector(
          `[data-project-index="${previousCount}"]`
        );
        if (newProjectsSection) {
          newProjectsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 100);
    }, 500);
  };

  const displayedProjects = projects.slice(0, visibleProjects);
  const hasMoreProjects = visibleProjects < projects.length;

  if (loading) {
    return (
      <section id="projects" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            🚀 My Work
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            A showcase of my recent work and the technologies I've used to build
            them
          </p>
          {projects.length > 0 && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span>
                Showing {Math.min(visibleProjects, projects.length)} of{" "}
                {projects.length} projects
                {projects.length > visibleProjects && (
                  <span className="ml-1 text-blue-500 font-medium">
                    • Load {isMobile ? "3" : "6"} at a time
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              data-project-index={index}
              className={`card overflow-hidden group animate-slide-up hover:transform hover:scale-105 transition-all duration-300 ${
                project.featured ? "ring-2 ring-purple-200" : ""
              }`}
            >
              {project.featured && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
              )}

              <div
                className="relative overflow-hidden group/image"
                onMouseEnter={() =>
                  setPauseAutoSlide((prev) => ({ ...prev, [project.id]: true }))
                }
                onMouseLeave={() =>
                  setPauseAutoSlide((prev) => ({
                    ...prev,
                    [project.id]: false,
                  }))
                }
              >
                {project.allImages && project.allImages.length > 0 ? (
                  <>
                    {/* Image container with smooth transition */}
                    <div className="relative w-full h-48 overflow-hidden">
                      {project.allImages.map((image, imageIndex) => (
                        <img
                          key={imageIndex}
                          src={`http://localhost:5000/uploads/${image.path}`}
                          alt={`${project.title} - Image ${imageIndex + 1}`}
                          className={`absolute inset-0 w-full h-48 object-cover transition-all duration-500 ease-in-out transform group-hover:scale-110 ${
                            imageIndex === (currentImageIndex[project.id] || 0)
                              ? "opacity-100 translate-x-0"
                              : imageIndex <
                                (currentImageIndex[project.id] || 0)
                              ? "opacity-0 -translate-x-full"
                              : "opacity-0 translate-x-full"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Navigation arrows */}
                    {project.allImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlePrevImage(project.id);
                          }}
                          disabled={isTransitioning[project.id]}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:bg-black/70 hover:scale-110 disabled:opacity-50 z-10"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNextImage(project.id);
                          }}
                          disabled={isTransitioning[project.id]}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:bg-black/70 hover:scale-110 disabled:opacity-50 z-10"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image indicators */}
                    {project.allImages.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {project.allImages.map((_, imageIndex) => (
                          <button
                            key={imageIndex}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleIndicatorClick(project.id, imageIndex);
                            }}
                            disabled={isTransitioning[project.id]}
                            className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 disabled:opacity-50 ${
                              imageIndex ===
                              (currentImageIndex[project.id] || 0)
                                ? "bg-white scale-110"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Image counter */}
                    {project.allImages.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-medium z-10">
                        {(currentImageIndex[project.id] || 0) + 1}/
                        {project.allImages.length}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                  <div className="flex space-x-3">
                    {project.live_link && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors transform hover:scale-105"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors transform hover:scale-105"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3">
                  {project.job_desk && (
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-xs rounded-full font-medium">
                      {project.job_desk}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {project.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies &&
                    project.technologies.split(",").map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 text-xs rounded-full font-medium"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-500">
              Projects will appear here once they are added to the database.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMoreProjects && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>
                    Load More Projects ({projects.length - visibleProjects}{" "}
                    remaining) - {isMobile ? "+3" : "+6"} more
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* GitHub Link - only show when all projects are loaded */}
        {!hasMoreProjects && projects.length > 0 && (
          <div className="text-center mt-12">
            <div className="mb-4">
              <p className="text-gray-600 font-medium">
                🎉 All {projects.length} projects displayed!
              </p>
            </div>
            <a
              href="https://github.com/akbarryyan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.083.346-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
              </svg>
              <span>Visit My GitHub</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
