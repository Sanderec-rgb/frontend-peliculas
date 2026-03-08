import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTipos, deleteTipo } from '../../services/tipoService';
import Swal from 'sweetalert2';

const TipoList = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTipos();
  }, []);

  const loadTipos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getTipos();
      console.log('📦 Respuesta completa de tipos:', response);
      console.log('📦 Data recibida:', response.data);

      // EXTRAER EL ARRAY CORRECTAMENTE
      let tiposArray = [];

      if (Array.isArray(response.data)) {
        // Caso 1: Ya es un array directamente
        tiposArray = response.data;
      } 
      else if (response.data && typeof response.data === 'object') {
        // Caso 2: Es un objeto, buscar cualquier propiedad que sea array
        const posiblesArrays = Object.values(response.data).filter(Array.isArray);
        
        if (posiblesArrays.length > 0) {
          // Tomar el primer array encontrado (ej: { data: [...], message: 'ok' })
          tiposArray = posiblesArrays[0];
        } else {
          // Caso 3: Es un objeto pero no contiene arrays, podría ser un solo objeto
          // Lo envolvemos en un array para poder mapearlo
          tiposArray = [response.data];
          console.log('⚠️ Objeto único envuelto en array');
        }
      }

      console.log('✅ Array de tipos extraído:', tiposArray);
      setTipos(tiposArray);

    } catch (error) {
      console.error('❌ Error al cargar tipos:', error);
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los tipos'
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
        await deleteTipo(id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El tipo ha sido eliminado',
          timer: 1500
        });
        loadTipos();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el tipo'
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
          <h4>Error al cargar datos</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadTipos}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Tipos de Multimedia</h2>
        <Link to="/tipos/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nuevo Tipo
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
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tipos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No hay tipos registrados
                    </td>
                  </tr>
                ) : (
                  tipos.map((tipo, index) => (
                    <tr key={tipo.id || tipo._id || index}>
                      <td>{tipo.nombre}</td>
                      <td>{tipo.descripcion || 'Sin descripción'}</td>
                      <td>{tipo.fechaCreacion ? new Date(tipo.fechaCreacion).toLocaleDateString() : 'N/A'}</td>
                      <td className="table-actions">
                        <Link
                          to={`/tipos/editar/${tipo.id || tipo._id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(tipo.id || tipo._id)}
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

export default TipoList;