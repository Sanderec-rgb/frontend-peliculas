import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDirector, createDirector, updateDirector } from '../../services/directorService';
import Swal from 'sweetalert2';

const DirectorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [director, setDirector] = useState({
    nombres: '',
    estado: 'Activo'
  });

  useEffect(() => {
    if (id) {
      loadDirector();
    }
  }, [id]);

  const loadDirector = async () => {
    try {
      setLoading(true);
      const response = await getDirector(id);
      setDirector(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el director'
      });
      navigate('/directores');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setDirector({
      ...director,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (id) {
        await updateDirector(id, director);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Director actualizado correctamente',
          timer: 1500
        });
      } else {
        await createDirector(director);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Director creado correctamente',
          timer: 1500
        });
      }
      navigate('/directores');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${id ? 'actualizar' : 'crear'} el director`
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
              <h4 className="mb-0">{id ? 'Editar Director' : 'Nuevo Director'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombres" className="form-label">
                    Nombres <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombres"
                    name="nombres"
                    value={director.nombres}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">
                    Estado
                  </label>
                  <select
                    className="form-control"
                    id="estado"
                    name="estado"
                    value={director.estado}
                    onChange={handleChange}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/directores')}
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

export default DirectorForm;