import React from 'react';
import '../styles/Footer.css'; // Импортируем стили

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>
          Сделано с помощью Gemini, т.к Taskov1ch полный ноль в фронтенде :)
        </p>
        {/* Можно добавить ссылки на соцсети или GitHub, если захотите */}
      </div>
    </footer>
  );
}

export default Footer;