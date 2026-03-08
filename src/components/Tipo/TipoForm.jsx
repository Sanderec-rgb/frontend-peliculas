import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTipo, createTipo, updateTipo } from '../../services/tipoService';
import Swal from 'sweetalert2';

const TipoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    if (id) {
      loadTipo();
    }
  }, [id]);

  const loadTipo = async () => {
    try {
      setLoading(true);
      const response = await getTipo(id);
      setTipo(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el tipo'
      });
      navigate('/tipos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setTipo({
      ...tipo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (id) {
        await updateTipo(id, tipo);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Tipo actualizado correctamente',
          timer: 1500
        });
      } else {
        await createTipo(tipo);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Tipo creado correctamente',
          timer: 1500
        });
      }
      navigate('/tipos');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${id ? 'actualizar' : 'crear'} el tipo`
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{id ? 'Editar Tipo' : 'Nuevo Tipo'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={tipo.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    rows="3"
                    value={tipo.descripcion}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/tipos')}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : (
                      'Guardar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipoForm;