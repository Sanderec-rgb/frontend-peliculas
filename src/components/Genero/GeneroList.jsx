import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGeneros, deleteGenero } from '../../services/generoService';
import Swal from 'sweetalert2';

const GeneroList = () => {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGeneros();
  }, []);

  const loadGeneros = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getGeneros();
      console.log('📦 Datos recibidos:', response); // Ver qué estructura tiene
      
      // Verificar la estructura de la respuesta
      if (response.data && Array.isArray(response.data)) {
        setGeneros(response.data);
      } else if (Array.isArray(response)) {
        setGeneros(response);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setGeneros(response.data.data);
      } else {
        console.error('Estructura no esperada:', response);
        setError('La respuesta de la API no tiene el formato esperado');
        setGeneros([]);
      }
      
    } catch (error) {
      console.error('Error al cargar géneros:', error);
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los géneros'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteGenero(id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El género ha sido eliminado',
          timer: 1500
        });
        loadGeneros();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el género'
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadGeneros}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Verificar si generos es realmente un array
  if (!Array.isArray(generos)) {
    console.log('generos no es array:', generos);
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <h4>Error de datos</h4>
          <p>Los datos recibidos no son un array</p>
          <pre>{JSON.stringify(generos, null, 2)}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Géneros</h2>
        <Link to="/generos/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nuevo Género
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {generos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay géneros registrados
                    </td>
                  </tr>
                ) : (
                  generos.map((genero) => (
                    <tr key={genero.id || genero._id || Math.random()}>
                      <td>{genero.nombre}</td>
                      <td>{genero.descripcion || 'Sin descripción'}</td>
                      <td>
                        <span className={`badge ${genero.estado === 'Activo' || genero.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                          {genero.estado}
                        </span>
                      </td>
                      <td>{genero.fechaCreacion ? new Date(genero.fechaCreacion).toLocaleDateString() : 'N/A'}</td>
                      <td className="table-actions">
                        <Link
                          to={`/generos/editar/${genero.id || genero._id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(genero.id || genero._id)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="bi bi-trash"></i> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneroList;