import {
  getAllProjects,
  getProjectById,
  createProject,
  insertProjectImages,
  updateProject,
  deleteProject,
} from "../models/Project.js";
import pool from "../config/db.js";

export const fetchProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const fetchProjectById = async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addProject = async (req, res) => {
  try {
    const { title, description, github_link, live_link, featured } = req.body;

    const overviewImage = req.file ? req.file.filename : null;

    const projectId = await createProject({
      title,
      description,
      github_link,
      live_link,
      featured: featured ? 1 : 0,
      overview_image: overviewImage,
    });

    res.status(201).json({
      success: true,
      message: "Project created",
      projectId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const uploadProjectImages = async (req, res) => {
  try {
    const projectId = req.params.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    await insertProjectImages(projectId, files);

    res.status(201).json({
      success: true,
      message: `${files.length} images uploaded`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, github_link, live_link, featured } = req.body;

    const projectData = {
      title,
      description,
      github_link,
      live_link,
      featured: featured ? 1 : 0,
    };

    if (req.file) {
      projectData.overview_image = req.file.filename;
    }

    const result = await updateProject(id, projectData);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, message: "Project updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const removeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProject(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const assignTechnologiesToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { technologyIds } = req.body;

    // Delete existing project technologies
    await pool.query("DELETE FROM project_technologies WHERE project_id = ?", [
      id,
    ]);

    // Insert new project technologies
    if (technologyIds && technologyIds.length > 0) {
      const values = technologyIds.map((techId) => [id, techId]);
      await pool.query(
        "INSERT INTO project_technologies (project_id, technology_id) VALUES ?",
        [values]
      );
    }

    res.json({ success: true, message: "Technologies updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProjectTechnologies = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT t.id as technology_id, t.name as technology_name
       FROM technologies t 
       JOIN project_technologies pt ON t.id = pt.technology_id 
       WHERE pt.project_id = ?`,
      [id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProjectImage = async (req, res) => {
  try {
    const { id, imagePath } = req.params;

    // Delete from database
    await pool.query(
      "DELETE FROM project_images WHERE project_id = ? AND image_path = ?",
      [id, imagePath]
    );

    // You might also want to delete the physical file from the server
    // const fs = require('fs');
    // const path = require('path');
    // const filePath = path.join(__dirname, '../uploads', imagePath);
    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all project images with project info
export const getAllProjectImages = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pi.project_id, pi.image_path, p.title as project_title
      FROM project_images pi
      JOIN projects p ON pi.project_id = p.id
      ORDER BY p.title, pi.image_path
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching all project images:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch project images" });
  }
};

// Get all project technologies with project and technology info
export const getAllProjectTechnologies = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pt.project_id, pt.technology_id, p.title as project_title, t.name as technology_name
      FROM project_technologies pt
      JOIN projects p ON pt.project_id = p.id
      JOIN technologies t ON pt.technology_id = t.id
      ORDER BY p.title, t.name
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching all project technologies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project technologies",
    });
  }
};

// Remove a technology from a project
export const removeProjectTechnology = async (req, res) => {
  try {
    const { projectId, technologyId } = req.params;

    await pool.query(
      "DELETE FROM project_technologies WHERE project_id = ? AND technology_id = ?",
      [projectId, technologyId]
    );

    res.json({ success: true, message: "Technology removed from project" });
  } catch (error) {
    console.error("Error removing technology from project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove technology from project",
    });
  }
};
