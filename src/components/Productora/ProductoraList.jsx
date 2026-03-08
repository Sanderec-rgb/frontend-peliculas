import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductoras, deleteProductora } from '../../services/productoraService';
import Swal from 'sweetalert2';

const ProductoraList = () => {
  const [productoras, setProductoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductoras();
  }, []);

  const loadProductoras = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProductoras();
      console.log('📦 Respuesta completa de productoras:', response);
      console.log('📦 Data recibida:', response.data);

      // EXTRAER EL ARRAY CORRECTAMENTE
      let productorasArray = [];

      if (Array.isArray(response.data)) {
        // Caso 1: Ya es un array directamente
        productorasArray = response.data;
      } 
      else if (response.data && typeof response.data === 'object') {
        // Caso 2: Es un objeto, buscar cualquier propiedad que sea array
        const posiblesArrays = Object.values(response.data).filter(Array.isArray);
        
        if (posiblesArrays.length > 0) {
          // Tomar el primer array encontrado (ej: { data: [...], message: 'ok' })
          productorasArray = posiblesArrays[0];
        } else {
          // Caso 3: Es un objeto pero no contiene arrays, podría ser un solo objeto
          // Lo envolvemos en un array para poder mapearlo
          productorasArray = [response.data];
          console.log('⚠️ Objeto único envuelto en array');
        }
      }

      console.log('✅ Array de productoras extraído:', productorasArray);
      setProductoras(productorasArray);

    } catch (error) {
      console.error('❌ Error al cargar productoras:', error);
      setError(error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las productoras'
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
        await deleteProductora(id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La productora ha sido eliminada',
          timer: 1500
        });
        loadProductoras();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la productora'
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
          <button className="btn btn-primary" onClick={loadProductoras}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Productoras</h2>
        <Link to="/productoras/nuevo" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nueva Productora
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Slogan</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productoras.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay productoras registradas
                    </td>
                  </tr>
                ) : (
                  productoras.map((productora, index) => (
                    <tr key={productora.id || productora._id || index}>
                      <td>{productora.nombre}</td>
                      <td>{productora.slogan || 'N/A'}</td>
                      <td>{productora.descripcion || 'Sin descripción'}</td>
                      <td>
                        <span className={`badge ${productora.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                          {productora.estado}
                        </span>
                      </td>
                      <td className="table-actions">
                        <Link
                          to={`/productoras/editar/${productora.id || productora._id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          <i className="bi bi-pencil"></i> Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(productora.id || productora._id)}
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

export default ProductoraList;