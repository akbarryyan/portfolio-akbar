import express from "express";
import multer from "multer";
import {
  fetchProjects,
  fetchProjectById,
  addProject,
  uploadProjectImages,
  editProject,
  removeProject,
  assignTechnologiesToProject,
  getProjectTechnologies,
  deleteProjectImage,
  getAllProjectImages,
  getAllProjectTechnologies,
  removeProjectTechnology,
} from "../controllers/projectController.js";

const router = express.Router();

// === Setup Multer Storage ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// === GET all projects
router.get("/projects", fetchProjects);

// === GET project by id
router.get("/projects/:id", fetchProjectById);

// === POST project (upload overview image)
router.post("/projects", upload.single("overview_image"), addProject);

// === POST multi images for project gallery
router.post(
  "/projects/:id/images",
  upload.array("images", 10),
  uploadProjectImages
);

// === PUT update project
router.put("/projects/:id", upload.single("overview_image"), editProject);

// === DELETE project
router.delete("/projects/:id", removeProject);

// === POST assign technologies to project
router.post("/projects/:id/technologies", assignTechnologiesToProject);

// === GET project technologies
router.get("/projects/:id/technologies", getProjectTechnologies);

// === DELETE project image
router.delete("/projects/:id/images/:imagePath", deleteProjectImage);

// === GET all project images
router.get("/project-images", getAllProjectImages);

// === GET all project technologies
router.get("/project-technologies", getAllProjectTechnologies);

// === DELETE technology from project
router.delete(
  "/project-technologies/:projectId/:technologyId",
  removeProjectTechnology
);

export default router;
