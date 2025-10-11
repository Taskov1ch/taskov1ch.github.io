import React from 'react';
import { useLocation } from 'react-router-dom';

function StaticPageViewer({ fileName }) {
  const baseUrl = import.meta.env.BASE_URL;
  const pageUrl = `${baseUrl}static/${fileName}`;

  return (
    <iframe
      src={pageUrl}
      title="Static Content"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  );
}

export default StaticPageViewer;
