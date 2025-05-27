import React from 'react';
import '../styles/Projects.css'; // Стили будут в одном файле

function ProjectCard({ project, isMain }) {
  return (
    <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" className={`project-card ${isMain ? 'main-project' : ''}`}>
        <div className="card-image-container">
            <img src={project.cover} alt={`${project.title} cover`} className="card-cover" />
            <div className="card-overlay">
                 <span className="view-project-btn">Посмотреть</span>
            </div>
        </div>
        <div className="card-content">
            <h3 className="card-title">{project.title}</h3>
            <p className="card-description">{project.description}</p>
            <div className="card-langs">
                {project.lang.map((lang, index) => (
                    <span key={index} className="lang-tag">{lang}</span>
                ))}
            </div>
        </div>
         {isMain && <div className="main-project-badge">⭐ Главный</div>}
    </a>
  );
}

export default ProjectCard;