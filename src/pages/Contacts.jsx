import React, { useState, useEffect } from "react";
import InfoCard from "../components/InfoCard";
import "../styles/InfoCard.css";
import LoadingSpinner from "../components/LoadingSpinner";

function Contacts() {
  const [contactsData, setContactsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          "https://github.com/Taskov1ch-Repos/trash/raw/refs/heads/main/data/contacts.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setContactsData(data);
      } catch (e) {
        console.error("Failed to fetch contacts:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
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
        <p>Ошибка загрузки контактов: {error}</p>
      </div>
    );
  }

  return (
    <div className='page-container contacts-page'>
      <h2>Связь со мной</h2>
      <div className='info-card-list'>
        {contactsData.map((item) => (
          <InfoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Contacts;
