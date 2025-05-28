import React from "react";
import contactsData from "../data/contacts.js";
import InfoCard from "../components/InfoCard";
import "../styles/InfoCard.css"; // Используем общие стили

function Contacts() {
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
