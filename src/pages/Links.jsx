import React from "react";
import linksData from "../data/links.js";
import InfoCard from "../components/InfoCard";
import "../styles/InfoCard.css"; // Используем общие стили

function Links() {
  return (
    <div className='page-container links-page'>
      <h2>Полезные Ссылки</h2>
      <div className='info-card-list'>
        {linksData.map((item) => (
          <InfoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Links;
