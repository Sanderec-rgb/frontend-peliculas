// Importar el componente de depuración
import DebugAPI from './components/DebugAPI.jsx';
// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';

// Importar componentes con .jsx
import GeneroList from './components/Genero/GeneroList.jsx';
import GeneroForm from './components/Genero/GeneroForm.jsx';
import DirectorList from './components/Director/DirectorList.jsx';
import DirectorForm from './components/Director/DirectorForm.jsx';
import ProductoraList from './components/Productora/ProductoraList.jsx';
import ProductoraForm from './components/Productora/ProductoraForm.jsx';
import TipoList from './components/Tipo/TipoList.jsx';
import TipoForm from './components/Tipo/TipoForm.jsx';
import MediaList from './components/Media/MediaList.jsx';
import MediaForm from './components/Media/MediaForm.jsx';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="container text-center mt-5">
                <h1>Bienvenido al Sistema de Gestión de Películas</h1>
                <p className="lead mt-3">
                  Selecciona una opción del menú para comenzar a gestionar
                </p>
              </div>
            } />
            
            {/* Rutas Género */}
            <Route path="/generos" element={<GeneroList />} />
            <Route path="/generos/nuevo" element={<GeneroForm />} />
            <Route path="/generos/editar/:id" element={<GeneroForm />} />
            
            {/* Rutas Director */}
            <Route path="/directores" element={<DirectorList />} />
            <Route path="/directores/nuevo" element={<DirectorForm />} />
            <Route path="/directores/editar/:id" element={<DirectorForm />} />

            <Route path="/debug" element={<DebugAPI />} />
            
            {/* Rutas Productora */}
            <Route path="/productoras" element={<ProductoraList />} />
            <Route path="/productoras/nuevo" element={<ProductoraForm />} />
            <Route path="/productoras/editar/:id" element={<ProductoraForm />} />
            
            {/* Rutas Tipo */}
            <Route path="/tipos" element={<TipoList />} />
            <Route path="/tipos/nuevo" element={<TipoForm />} />
            <Route path="/tipos/editar/:id" element={<TipoForm />} />
            
            {/* Rutas Media */}
            <Route path="/medias" element={<MediaList />} />
            <Route path="/medias/nuevo" element={<MediaForm />} />
            <Route path="/medias/editar/:id" element={<MediaForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;