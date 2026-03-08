import React, { useState } from 'react';
import { getGeneros } from '../services/generoService';

const DebugAPI = () => {
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);

  const probarAPI = async () => {
    try {
      setCargando(true);
      const res = await getGeneros();
      console.log('Respuesta completa:', res);
      setRespuesta({
        status: res.status,
        headers: res.headers,
        data: res.data,
        estructura: typeof res.data,
        esArray: Array.isArray(res.data)
      });
    } catch (error) {
      setRespuesta({
        error: error.message,
        stack: error.stack
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🔧 Depuración de API</h2>
      
      <button 
        className="btn btn-primary mb-3" 
        onClick={probarAPI}
        disabled={cargando}
      >
        {cargando ? 'Probando...' : 'Probar Conexión a API'}
      </button>

      {respuesta && (
        <div className="card">
          <div className="card-header bg-info text-white">
            Respuesta de la API
          </div>
          <div className="card-body">
            <pre>{JSON.stringify(respuesta, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h4>Instrucciones:</h4>
        <ol>
          <li>Abre la consola del navegador (F12)</li>
          <li>Haz clic en "Probar Conexión a API"</li>
          <li>Revisa la consola para ver la respuesta exacta</li>
          <li>Comparte lo que aparece en la consola</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugAPI;