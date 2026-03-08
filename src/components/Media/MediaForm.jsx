import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMedia, createMedia, updateMedia } from '../../services/mediaService';
import { getGeneros } from '../../services/generoService';
import { getDirectores } from '../../services/directorService';
import { getProductoras } from '../../services/productoraService';
import { getTipos } from '../../services/tipoService';
import Swal from 'sweetalert2';

const MediaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);
  
  const [media, setMedia] = useState({
    serial: '',
    titulo: '',
    sinopsis: '',
    url: '',
    imagen: '',
    anioEstreno: new Date().getFullYear(),
    generoPrincipal: '',
    directorPrincipal: '',
    productora: '',
    tipo: ''
  });

  useEffect(() => {
    loadInitialData();
    if (id) {
      loadMedia();
    } else {
      setLoadingData(false);
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [generosRes, directoresRes, productorasRes, tiposRes] = await Promise.all([
        getGeneros(),
        getDirectores(),
        getProductoras(),
        getTipos()
      ]);
      
      setGeneros(generosRes.data.filter(g => g.estado === 'Activo'));
      setDirectores(directoresRes.data.filter(d => d.estado === 'Activo'));
      setProductoras(productorasRes.data.filter(p => p.estado === 'Activo'));
      setTipos(tiposRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos necesarios'
      });
    }
  };

  const loadMedia = async () => {
    try {
      setLoading(true);
      const response = await getMedia(id);
      const mediaData = response.data;
      setMedia({
        serial: mediaData.serial || '',
        titulo: mediaData.titulo || '',
        sinopsis: mediaData.sinopsis || '',
        url: mediaData.url || '',
        imagen: mediaData.imagen || '',
        anioEstreno: mediaData.anioEstreno || new Date().getFullYear(),
        generoPrincipal: mediaData.generoPrincipal?._id || '',
        directorPrincipal: mediaData.directorPrincipal?._id || '',
        productora: mediaData.productora?._id || '',
        tipo: mediaData.tipo?._id || ''
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la producción'
      });
      navigate('/medias');
    } finally {
      setLoading(false);
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setMedia({
      ...media,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!media.generoPrincipal) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar un género'
      });
      return;
    }
    
    if (!media.directorPrincipal) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar un director'
      });
      return;
    }
    
    if (!media.productora) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar una productora'
      });
      return;
    }
    
    if (!media.tipo) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Debe seleccionar un tipo'
      });
      return;
    }
    
    try {
      setLoading(true);
      if (id) {
        await updateMedia(id, media);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Producción actualizada correctamente',
          timer: 1500
        });
      } else {
        await createMedia(media);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Producción creada correctamente',
          timer: 1500
        });
      }
      navigate('/medias');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo ${id ? 'actualizar' : 'crear'} la producción`
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">{id ? 'Editar Producción' : 'Nueva Producción'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="serial" className="form-label">
                      Serial <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="serial"
                      name="serial"
                      value={media.serial}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="titulo" className="form-label">
                      Título <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      name="titulo"
                      value={media.titulo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="sinopsis" className="form-label">
                    Sinopsis <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="sinopsis"
                    name="sinopsis"
                    rows="3"
                    value={media.sinopsis}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="url" className="form-label">
                      URL <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="url"
                      name="url"
                      value={media.url}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="imagen" className="form-label">
                      URL de la Imagen
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      id="imagen"
                      name="imagen"
                      value={media.imagen}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="anioEstreno" className="form-label">
                      Año de Estreno <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="anioEstreno"
                      name="anioEstreno"
                      value={media.anioEstreno}
                      onChange={handleChange}
                      min="1900"
                      max="2099"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="tipo" className="form-label">
                      Tipo <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      id="tipo"
                      name="tipo"
                      value={media.tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un tipo</option>
                      {tipos.map(tipo => (
                        <option key={tipo._id} value={tipo._id}>
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="generoPrincipal" className="form-label">
                      Género Principal <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      id="generoPrincipal"
                      name="generoPrincipal"
                      value={media.generoPrincipal}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un género</option>
                      {generos.map(genero => (
                        <option key={genero._id} value={genero._id}>
                          {genero.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="directorPrincipal" className="form-label">
                      Director Principal <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-control"
                      id="directorPrincipal"
                      name="directorPrincipal"
                      value={media.directorPrincipal}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un director</option>
                      {directores.map(director => (
                        <option key={director._id} value={director._id}>
                          {director.nombres}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="productora" className="form-label">
                    Productora <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    id="productora"
                    name="productora"
                    value={media.productora}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una productora</option>
                    {productoras.map(productora => (
                      <option key={productora._id} value={productora._id}>
                        {productora.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/medias')}
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

export default MediaForm;