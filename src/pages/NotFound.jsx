import React from "react";
import { Link } from "react-router-dom";
import "../styles/InfoCard.css";

function NotFound() {
  return (
    <div
      className='page-container not-found-page'
      style={{
        textAlign: "center",
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1
        style={{ fontSize: "6rem", margin: "0", color: "var(--primary-blue)" }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          margin: "10px 0 20px",
          color: "var(--text-primary)",
        }}
      >
        Страница не найдена
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>
        Упс! Кажется, вы забрели не туда. Запрашиваемой страницы не существует.
      </p>
      <Link
        to='/'
        className='cta-button'
        style={{ display: "inline-block", textDecoration: "none" }}
      >
        Вернуться на главную
      </Link>
    </div>
  );
}

export default NotFound;
