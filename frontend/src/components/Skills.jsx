const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: "🎨",
      skills: [
        "React.js",
        "JavaScript (ES6+)",
        "Vue.js",
        "HTML5 & CSS3",
        "Tailwind CSS",
        "Sass/SCSS",
        "Bootstrap",
        "Responsive Design",
        "Flutter & Dart",
      ],
    },
    {
      title: "Backend Development",
      icon: "⚙️",
      skills: [
        "Node.js",
        "Express.js",
        "PHP",
        "Laravel",
        "Python",
        "Flask",
        "MySQL",
        "REST APIs",
      ],
    },
    {
      title: "Tools & Technologies",
      icon: "🛠️",
      skills: [
        "Git & GitHub",
        "Docker",
        "Firebase",
        "Vercel",
        "Trello",
        "Figma",
        "Postman",
        "VS Code",
        "Xampp",
        "Cursor",
      ],
    },
  ];

  return (
    <section id="skills" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            💻 My Expertise
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here are the technologies and tools I use to bring creative ideas to
            life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="card p-8 animate-slide-up hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {category.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-lg text-center hover:from-purple-100 hover:to-blue-100 transition-all duration-200 cursor-default"
                  >
                    <span className="text-gray-700 text-sm font-medium">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 sm:px-8 py-6 rounded-2xl mx-4 sm:mx-0">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">50+</div>
                <div className="text-gray-600 text-sm">Projects Completed</div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div className="block sm:hidden w-12 h-px bg-gray-300"></div>

              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">3+</div>
                <div className="text-gray-600 text-sm">Years Experience</div>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div className="block sm:hidden w-12 h-px bg-gray-300"></div>

              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">100%</div>
                <div className="text-gray-600 text-sm">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
