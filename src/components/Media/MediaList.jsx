import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedias, deleteMedia } from '../../services/mediaService';
import Swal from 'sweetalert2';

const MediaList = () => {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMedias();
  }, []);

  const loadMedias = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getMedias();
      console.log('📦 Respuesta completa de medias:', response);
      console.log('📦 Data recibida:', response.data);

      // EXTRAER EL ARRAY CORRECTAMENTE
      let mediasArray = [];

      if (Array.isArray(response.data)) {
        // Caso 1: Ya es un array directamente
        mediasArray = response.data;
      } 
      else if (response.data && typeof response.data === 'object') {
        // Caso 2: Es un objeto, buscar cualquier propiedad que sea array
        const posiblesArrays = Object.values(response.data).filter(Array.isArray);
        
        if (posiblesArrays.length > 0) {
          // Tomar el primer array encontrado (ej: { data: [...], message: 'ok' })
          mediasArray = posiblesArrays[0];
        } else {
          // Caso 3: Es un objeto pero no contiene arrays, podría ser un solo objeto
          // Lo envolvemos en un array para poder mapearlo
          mediasArray = [response.data];
          console.log('⚠️ Objeto único envuelto en array');
        }
      }

      console.log('✅ Array de medias extraído:', mediasArray);
      setMedias(mediasArray);

    } catch (error) {
      console.error('❌ Error al cargar medias:', error);
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las producciones'
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
        await deleteMedia(id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La producción ha sido eliminada',
          timer: 1500
        });
        loadMedias();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la producción'
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
          <button className="btn btn-primary" onClick={loadMedias}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Películas y Series</h2>
        <Link to="/medias/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nueva Producción
        </Link>
      </div>

      <div className="row">
        {medias.length === 0 ? (
          <div className="col-12 text-center">
            <p>No hay producciones registradas</p>
          </div>
        ) : (
          medias.map((media, index) => (
            <div className="col-md-4 mb-4" key={media.id || media._id || index}>
              <div className="card h-100">
                {media.imagen && (
                  <img 
                    src={media.imagen} 
                    className="card-img-top" 
                    alt={media.titulo}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                    }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{media.titulo}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    Serial: {media.serial}
                  </h6>
                  <p className="card-text">{media.sinopsis?.substring(0, 100)}...</p>
                  <div className="mb-2">
                    <span className="badge bg-primary me-1">{media.tipo?.nombre || 'N/A'}</span>
                    <span className="badge bg-success me-1">{media.generoPrincipal?.nombre || 'N/A'}</span>
                    <span className="badge bg-info me-1">{media.anioEstreno || 'N/A'}</span>
                  </div>
                  <p className="card-text">
                    <small className="text-muted">
                      Director: {media.directorPrincipal?.nombres || 'N/A'}<br />
                      Productora: {media.productora?.nombre || 'N/A'}
                    </small>
                  </p>
                </div>
                <div className="card-footer">
                  <Link
                    to={`/medias/editar/${media.id || media._id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(media.id || media._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MediaList;