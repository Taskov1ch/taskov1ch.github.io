import React, { useState, useEffect } from "react";
import InfoCard from "../components/InfoCard";
import "../styles/InfoCard.css";
import LoadingSpinner from "../components/LoadingSpinner";

function Links() {
  const [linksData, setLinksData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          "https://raw.githubusercontent.com/2Taskov1ch/tynaevtaskovich.github.io/refs/heads/main/data/links.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinksData(data);
      } catch (e) {
        console.error("Failed to fetch links:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
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
        <p>Ошибка загрузки ссылок: {error}</p>
      </div>
    );
  }

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
