import pool from "../config/db.js";

export const getAllProjects = async () => {
  const [rows] = await pool.query(
    `SELECT p.*,
  GROUP_CONCAT(DISTINCT t.name) AS technologies,
  (
    SELECT GROUP_CONCAT(image_path)
    FROM project_images
    WHERE project_id = p.id
  ) AS images
FROM projects p
LEFT JOIN project_technologies pt ON p.id = pt.project_id
LEFT JOIN technologies t ON pt.technology_id = t.id
GROUP BY p.id`
  );
  return rows;
};

export const getProjectById = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.*, 
            GROUP_CONCAT(t.name) AS technologies,
            (
              SELECT JSON_ARRAYAGG(image_path)
              FROM project_images
              WHERE project_id = p.id
            ) AS images
     FROM projects p
     LEFT JOIN project_technologies pt ON p.id = pt.project_id
     LEFT JOIN technologies t ON pt.technology_id = t.id
     WHERE p.id = ?
     GROUP BY p.id`,
    [id]
  );
  return rows[0];
};

export const createProject = async (projectData) => {
  const {
    title,
    description,
    github_link,
    live_link,
    featured,
    overview_image,
  } = projectData;

  const [result] = await pool.query(
    `INSERT INTO projects 
     (title, description, github_link, live_link, featured, overview_image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, github_link, live_link, featured, overview_image]
  );

  return result.insertId;
};

export const insertProjectImages = async (projectId, files) => {
  const values = files.map((file) => [projectId, file.filename]);
  await pool.query(
    `INSERT INTO project_images (project_id, image_path) VALUES ?`,
    [values]
  );
};

export const updateProject = async (id, projectData) => {
  const {
    title,
    description,
    github_link,
    live_link,
    featured,
    overview_image,
  } = projectData;

  let query = "UPDATE projects SET title = ?, description = ?, github_link = ?, live_link = ?, featured = ?";
  const params = [title, description, github_link, live_link, featured];

  if (overview_image) {
    query += ", overview_image = ?";
    params.push(overview_image);
  }

  query += " WHERE id = ?";
  params.push(id);

  const [result] = await pool.query(query, params);
  return result;
};

export const deleteProject = async (id) => {
  const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [id]);
  return result;
};
