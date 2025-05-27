import React from 'react';
import projectsData from '../data/projects.js';
import ProjectCard from '../components/ProjectCard';
import '../styles/Projects.css';
import { motion } from 'framer-motion';

function Projects() {
  const mainProjects = projectsData.filter(p => p.isMain);
  const otherProjects = projectsData.filter(p => !p.isMain);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Задержка между появлением карточек
      },
    },
  };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };


  return (
    <div className="projects-container container">
      <h2>Главные проекты</h2>
      <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
      >
        {mainProjects.map(project => (
          <motion.div key={project.id} variants={itemVariants}>
            <ProjectCard project={project} isMain={true} />
          </motion.div>
        ))}
      </motion.div>

      <h2>Остальные проекты</h2>
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
      >
        {otherProjects.map(project => (
          <motion.div key={project.id} variants={itemVariants}>
             <ProjectCard project={project} isMain={false} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Projects;