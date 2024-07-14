import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar({ isAuthenticated }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { id: 1, path: "/", text: "Home" },
  ];

  if(!isAuthenticated){
    links.push({ id: 2, path: "/login", text: "Login" })
    links.push({ id: 3, path: "/register", text: "Register"})
  }

  if(isAuthenticated){
    links.push({ id: 2, path: "/stories", text: "Stories" })
    links.push({ id: 3, path: "/articleManagement", text: "Article Management"})
    links.push({ id: 4, path: "", text:"Logout"})
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    onLogout();

    window.location.href = '/';
};

  return (
    <nav>
      <div className="responsive-nav">
        <div className="logo">
          <h1>Journalism.nl</h1>
        </div>

        <div className="burger-menu">
          <a id="burger" href="#" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </a>
        </div>
      </div>

      <div className={`links ${isMenuOpen ? "open" : ""}`}>
        <ul>
          {links.map((link) => {

            if (link.hidden) {
              return null;
            }
            return (
              <li key={link.id}>
                <NavLink to={link.path} onClick={link.text === "Logout" ? handleLogout : undefined}>
                  {link.text}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
