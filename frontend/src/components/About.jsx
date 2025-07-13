const About = () => {
  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            👨‍💻 Get to know me
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Passionate full-stack developer with 3+ years of experience building
            scalable web applications
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Profile Image Section */}
          <div className="animate-slide-up px-4 lg:px-0">
            <div className="relative max-w-md mx-auto">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 rounded-3xl transform rotate-3 opacity-60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-3xl transform -rotate-2 opacity-40"></div>

              {/* Main profile container */}
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Profile Image */}
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Alex - Full Stack Developer"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-gray-700">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom info card */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                      <h3 className="font-bold text-gray-900 text-lg">
                        Akbar Rayyan Al Ghifari
                      </h3>
                      <p className="text-purple-600 font-medium text-sm">
                        Full-Stack Developer
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs text-gray-600">
                            Indonesia
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-white p-3 rounded-full shadow-lg animate-bounce-slow">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full shadow-lg animate-float">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="animate-slide-up px-4 lg:px-0">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  My Journey
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  My journey in web development began three years ago, and from
                  that first “Hello World” I knew I was hooked. Since then, I’ve
                  dedicated myself to turning complex challenges into simple,
                  elegant, and intuitive experiences.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Lately, I’ve been venturing into mobile development too,
                  bringing ideas to life on screens big and small. Outside of
                  coding, you’ll find me trying out new stacks, contributing to
                  open-source communities, or helping others grow through
                  writing and mentoring.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Great products are born when clean code meets thoughtful
                  design — and a good cup of coffee ☕. “One day or day one.”
                  For me, every day is day one.
                </p>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-700 font-medium">
                      Currently exploring Data Science and AI/ML.
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-700 font-medium">
                      Open to collaborations
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Cards */}
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-3 rounded-xl">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Frontend Development
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Creating responsive and interactive user interfaces
                        using React, Vue, and modern CSS frameworks.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Backend Development
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Building robust APIs and server-side applications using
                        PHP, Laravel, Node.js, Python, and various databases.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-xl">
                      {/* Android official logo SVG */}
                      <svg
                        className="w-6 h-6 text-green-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <g>
                          <path
                            d="M17.6 9.48l1.43-2.48a.5.5 0 0 0-.87-.5l-1.45 2.52A7.01 7.01 0 0 0 6.29 7.02L4.84 4.54a.5.5 0 1 0-.87.5l1.43 2.48A7.01 7.01 0 0 0 2 13.5V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5a7.01 7.01 0 0 0-2.4-4.02z"
                            fill="currentColor"
                          />
                          <rect
                            x="7"
                            y="15"
                            width="2"
                            height="2"
                            rx="1"
                            fill="#fff"
                          />
                          <rect
                            x="15"
                            y="15"
                            width="2"
                            height="2"
                            rx="1"
                            fill="#fff"
                          />
                          <circle cx="9" cy="8.5" r="1" fill="#fff" />
                          <circle cx="15" cy="8.5" r="1" fill="#fff" />
                        </g>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Mobile Development
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Developing cross-platform mobile applications using
                        React Native and Flutter for seamless user experiences
                        on iOS and Android.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
