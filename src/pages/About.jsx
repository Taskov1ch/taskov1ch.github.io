import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container container">
      <img src="https://via.placeholder.com/150/537895/e0e0e0?text=Me" alt="Taskov1ch" className="profile-pic" />
      <h1>Привет, я Taskov1ch! 👋</h1>
      <p className="subtitle">Junior Python Developer</p>
      <div className="about-content">
        <p>
          Я начинающий Python-разработчик, увлеченный созданием полезных и интересных приложений.
          Мой основной интерес лежит в области бэкенд-разработки и автоматизации,
          но я также изучаю фронтенд, чтобы понимать полный цикл разработки.
        </p>
        <p>
          Люблю решать сложные задачи, постоянно учусь новому и стремлюсь
          применять полученные знания на практике. В своих проектах я стараюсь использовать
          современные технологии и подходы.
        </p>
        <p>
          На этом сайте вы можете ознакомиться с моими проектами и найти способы
          связаться со мной. Буду рад обратной связи и предложениям!
        </p>
      </div>
       <h2>Мои навыки:</h2>
        <ul className="skills-list">
            <li>Python (Aiogram, Django (основы), FastAPI (основы))</li>
            <li>JavaScript (React)</li>
            <li>HTML & CSS</li>
            <li>SQL (SQLite, PostgreSQL (основы))</li>
            <li>Git & GitHub</li>
        </ul>
    </div>
  );
};

export default About;