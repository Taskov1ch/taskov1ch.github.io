import React, { useState, useEffect } from "react";
import InfoCard from "../components/InfoCard";
import "../styles/InfoCard.css";
import LoadingSpinner from "../components/LoadingSpinner";

function Donate() {
  const [donationsData, setDonationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          "https://github.com/Taskov1ch-Repos/trash/raw/refs/heads/main/data/donations.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDonationsData(data);
      } catch (e) {
        console.error("Failed to fetch donations:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
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
        <p>Ошибка загрузки: {error}</p>
      </div>
    );
  }

  return (
    <div className='page-container donate-page'>
      <h2>Поддержать Автора</h2>
      <div className='info-card-list'>
        {donationsData.map((item) => (
          <InfoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Donate;
