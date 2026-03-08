import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGenero, createGenero, updateGenero } from '../../services/generoService';
import Swal from 'sweetalert2';

const GeneroForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [genero, setGenero] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activo'
  });

  useEffect(() => {
    if (id) {
      loadGenero();
    }
  }, [id]);

  const loadGenero = async () => {
    try {
      setLoading(true);
      const response = await getGenero(id);
      setGenero(response.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el género'
      });
      navigate('/generos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setGenero({
      ...genero,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (id) {
        await updateGenero(id, genero);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Género actualizado correctamente',
          timer: 1500
        });
      } else {
        await createGenero(genero);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Género creado correctamente',
          timer: 1500
        });
      }
      navigate('/generos');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${id ? 'actualizar' : 'crear'} el género`
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
              <h4 className="mb-0">{id ? 'Editar Género' : 'Nuevo Género'}</h4>
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
                    value={genero.nombre}
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
                    value={genero.descripcion}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">
                    Estado
                  </label>
                  <select
                    className="form-control"
                    id="estado"
                    name="estado"
                    value={genero.estado}
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
                    onClick={() => navigate('/generos')}
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

export default GeneroForm;