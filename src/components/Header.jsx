import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/Header.css";

const getPageTitle = (pathname) => {
  switch (pathname) {
    case "/":
      return "Обо мне";
    case "/projects":
      return "Мои Проекты";
    case "/links":
      return "Ссылки";
    case "/contacts":
      return "Контакты";
    case "/donate":
      return "Задонатить";
    case "/dashboard":
      return "Моя доска"
    default:
      return "Taskov1ch";
  }
};
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <header className='header'>
      <nav className='navbar container'>
        <div className='nav-logo-placeholder'></div>
        <div className='page-title-mobile'>{pageTitle}</div>

        <div className={`nav-menu ${isOpen ? "active" : ""}`}>
          <NavLink to='/' className='nav-link' onClick={closeMenu}>
            Обо мне
          </NavLink>
          <NavLink to='/projects' className='nav-link' onClick={closeMenu}>
            Проекты
          </NavLink>

          <NavLink to='/links' className='nav-link' onClick={closeMenu}>
            Ссылки
          </NavLink>
          <NavLink to='/contacts' className='nav-link' onClick={closeMenu}>
            Контакты
          </NavLink>
          <NavLink to='/donate' className='nav-link' onClick={closeMenu}>
            Задонатить
          </NavLink>
          <NavLink to='/dashboard' className='nav-link' onClick={closeMenu}>
            Моя доска
          </NavLink>
        </div>

        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className='bar'></span>
          <span className='bar'></span>
          <span className='bar'></span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
