import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDirectores, deleteDirector } from '../../services/directorService';
import Swal from 'sweetalert2';

const DirectorList = () => {
  const [directores, setDirectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDirectores();
  }, []);

  const loadDirectores = async () => {
    try {
      setLoading(true);
      const response = await getDirectores();
      console.log('📦 Datos recibidos (completos):', response);
      console.log('📦 Data:', response.data);

      // 👇 SOLUCIÓN: Extraer el array correctamente
      // Si la respuesta es { data: [...] }
      if (response.data && Array.isArray(response.data)) {
        setDirectores(response.data);
      }
      // Si la respuesta es { directores: [...] }
      else if (response.data && response.data.directores && Array.isArray(response.data.directores)) {
        setDirectores(response.data.directores);
      }
      // Si la respuesta es directamente el array
      else if (Array.isArray(response.data)) {
        setDirectores(response.data);
      }
      // Si la respuesta es un objeto con propiedades
      else if (response.data && typeof response.data === 'object') {
        // Busca cualquier propiedad que sea un array
        const posibleArray = Object.values(response.data).find(val => Array.isArray(val));
        if (posibleArray) {
          setDirectores(posibleArray);
        } else {
          console.error('Estructura no reconocida:', response.data);
          setError('La respuesta de la API no tiene el formato esperado');
          setDirectores([]);
        }
      }
      else {
        setDirectores([]);
      }

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Eliminar director?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDirector(id);
          Swal.fire('Eliminado', 'Director eliminado', 'success');
          loadDirectores();
        } catch (error) {
          Swal.fire('Error', 'No se pudo eliminar', 'error');
        }
      }
    });
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Directores</h2>
        <Link to="/directores/nuevo" className="btn btn-primary">Nuevo Director</Link>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Nombres</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {directores.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No hay directores</td></tr>
              ) : (
                directores.map((director) => (
                  <tr key={director.id || director._id}>
                    <td>{director.nombres}</td>
                    <td>
                      <span className={`badge ${director.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                        {director.estado}
                      </span>
                    </td>
                    <td>{director.fechaCreacion ? new Date(director.fechaCreacion).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <Link to={`/directores/editar/${director.id || director._id}`} className="btn btn-warning btn-sm me-2">Editar</Link>
                      <button onClick={() => handleDelete(director.id || director._id)} className="btn btn-danger btn-sm">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DirectorList;