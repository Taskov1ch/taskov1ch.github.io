import React from 'react';
import './ContactButton.css';

const ContactButton = ({ name, value, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="contact-button">
      <span className="contact-name">{name}:</span>
      <span className="contact-value">{value}</span>
    </a>
  );
};

export default ContactButton;