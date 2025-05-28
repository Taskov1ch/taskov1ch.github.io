import React from "react";
import donationsData from "../data/donations.js";
import InfoCard from "../components/InfoCard";
import "../styles/InfoCard.css";

function Donate() {
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
