import React from 'react';
import '../styles/Projects.css';

function ProjectCard({ project, isMain }) {
  return (
    <a
      href={project.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`project-card ${isMain ? 'main-project' : ''}`}
      style={{ backgroundImage: `url(${project.cover})` }}
    >
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
      {/* Блок "view-project-overlay" УДАЛЕН отсюда */}
    </a>
  );
}

export default ProjectCard;