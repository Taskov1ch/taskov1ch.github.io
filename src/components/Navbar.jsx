import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="navbar-logo">Taskov1ch</NavLink>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
      </div>
      <ul className={isOpen ? "nav-links open" : "nav-links"}>
        <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Обо мне</NavLink></li>
        <li><NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Мои проекты</NavLink></li>
        <li><NavLink to="/contacts" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Мои контакты</NavLink></li>
        <li><NavLink to="/links" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setIsOpen(false)}>Мои ссылки</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;