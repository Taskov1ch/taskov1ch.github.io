import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useAnchorNavigation(isLoading) {
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`Scrolling to element: ${id}`);
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.warn(`Element with id "${id}" not found for anchor scroll.`);
        }
      }, 100);
    }
  }, [location.hash, isLoading])
}

export default useAnchorNavigation;