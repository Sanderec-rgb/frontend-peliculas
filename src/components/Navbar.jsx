import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🎬 Gestión Películas
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/generos')}`} to="/generos">
                Géneros
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/directores')}`} to="/directores">
                Directores
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/productoras')}`} to="/productoras">
                Productoras
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/tipos')}`} to="/tipos">
                Tipos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/medias')}`} to="/medias">
                Películas/Series
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; // <--- Asegurar que esta línea existe