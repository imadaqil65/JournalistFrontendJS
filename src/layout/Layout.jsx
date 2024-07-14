import React from "react";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  const getPageClass = (pathname) => {
    switch (pathname) {
      case '/articleManagement':
        return 'article-background-change';
      case '/':
        return 'home-background-change';
      // Add more cases here for other routes if needed
      default:
        return '';
    }
  };

  const pageClass = getPageClass(location.pathname);

  return (
    <div className={`App ${pageClass}`}>
      {children}
    </div>
  );
};

export default Layout;
