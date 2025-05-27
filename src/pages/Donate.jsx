import React from 'react';
import donationsData from '../data/donations.js';
import InfoCard from '../components/InfoCard';
import '../styles/InfoCard.css'; // Используем общие стили

function Donate() {
  return (
    <div className="page-container donate-page">
      <h2>Поддержать Автора</h2>
      <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px'}}>
        Если вам нравится то, что я делаю, или этот сайт оказался полезным,
        вы можете поддержать меня любым удобным способом ниже. Спасибо! ❤️
      </p>
      <div className="info-card-list">
        {donationsData.map(item => (
          <InfoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Donate;