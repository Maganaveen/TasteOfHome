import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} Taste of Home. All rights reserved. | Made with ❤️ by
          Magalakshmi
        </p>
      </div>
    </footer>
  );
};

export default Footer;d