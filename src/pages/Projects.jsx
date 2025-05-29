import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import "../styles/Projects.css";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";

function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          "https://raw.githubusercontent.com/2Taskov1ch/tynaevtaskovich.github.io/refs/heads/main/data/projects.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjectsData(data);
      } catch (e) {
        console.error("Failed to fetch projects:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className='page-loading-container'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='page-error-container'>
        <p>Ошибка загрузки проектов: {error}</p>
      </div>
    );
  }

  const mainProjects = projectsData.filter((p) => p.isMain);
  const otherProjects = projectsData.filter((p) => !p.isMain);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className='projects-container container'>
      <h2>Главные проекты</h2>
      <motion.div
        className='projects-grid'
        variants={containerVariants}
        initial='hidden'
        animate='show'
      >
        {mainProjects.map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <ProjectCard project={project} isMain={true} />
          </motion.div>
        ))}
      </motion.div>

      <h2>Остальные проекты</h2>
      <motion.div
        className='projects-grid'
        variants={containerVariants}
        initial='hidden'
        animate='show'
      >
        {otherProjects.map((project) => (
          <motion.div key={project.id} variants={itemVariants}>
            <ProjectCard project={project} isMain={false} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Projects;
