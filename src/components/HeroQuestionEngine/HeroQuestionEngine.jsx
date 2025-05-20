import React, { useState } from 'react';
import { Plus, Download, Search, MessageSquareText, Loader2, FileSpreadsheet, Database, AlertCircle } from 'lucide-react';

const HeroQuestionEngine = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  
  const suggested = [
    '¿Cuáles son los 5 productos más vendidos?',
    '¿Quiénes son los clientes que más compran en términos de importe?'
  ];

  const handleSubmit = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setResponse(null);
    setExecutionResult(null);
    
    try {
      const res = await fetch('https://fqpp49qx-8000.usw3.devtunnels.ms/pg-agent/sql-generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta: question }),
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error al enviar la pregunta:', error);
      setResponse({ error: 'Ocurrió un error al procesar tu pregunta.' });
    } finally {
      setLoading(false);
    }
  };

  // Función para exportar datos a Excel
  const exportToExcel = (data, columns, fileName) => {
    try {
      // Preparar los datos para Excel
      const exportData = data.map(row => {
        const newRow = {};
        columns.forEach(col => {
          newRow[col.label] = row[col.name];
        });
        return newRow;
      });
      
      // Crear un CSV en lugar de usar XLSX directamente
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Añadir encabezados
      const headers = columns.map(col => col.label);
      csvContent += headers.join(",") + "\r\n";
      
      // Añadir filas
      exportData.forEach(row => {
        const rowArray = headers.map(header => {
          // Escapar comillas y manejar valores que contienen comas
          const cellValue = row[header] === null ? '' : String(row[header]);
          return `"${cellValue.replace(/"/g, '""')}"`;
        });
        csvContent += rowArray.join(",") + "\r\n";
      });
      
      // Crear un enlace para la descarga
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      
      // Simular clic y limpiar
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al exportar a CSV:", error);
      alert("Error al exportar. Por favor, inténtelo de nuevo.");
    }
  };

  // Componente para renderizar la tabla de resultados
  const ResultTable = ({ data, columns }) => {
    if (!data || data.length === 0) return null;
    
    return (
      <div className="overflow-x-auto mt-6 rounded-xl shadow-md border border-blue-100">
        <table className="min-w-full bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#0d4b6d]/90 text-white">
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white hover:bg-blue-50 transition-colors' : 'bg-blue-50/30 hover:bg-blue-50 transition-colors'}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row[column.name]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-blue-50/50 to-white py-16 px-6 md:px-12 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Database className="text-[#0d4b6d] mr-3" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0d4b6d] to-[#1a6d94] bg-clip-text text-transparent">
              Consulta Inteligente
            </h1>
          </div>
          <p className="text-gray-600 md:text-lg max-w-2xl mx-auto">
            Realiza búsquedas específicas en tu base de datos y obtén información detallada sobre el estado actual de tu negocio.
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden backdrop-blur-sm bg-opacity-90 border border-blue-50">
          <div className="p-8">
            <div className="flex items-center mb-4 space-x-2 text-gray-500">
              <MessageSquareText size={20} className="text-[#0d4b6d]" />
              <h2 className="font-medium">Formula tu pregunta</h2>
            </div>
            
            <div className="relative">
              <textarea
                className="w-full border border-blue-100 rounded-xl p-5 pl-12 text-gray-700 mb-6 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6d94] focus:border-transparent shadow-sm"
                placeholder="¿Qué deseas conocer sobre tu negocio?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Search className="absolute top-5 left-4 text-[#1a6d94]" size={20} />
            </div>
            
            <div className="space-y-5 md:space-y-0 md:flex items-center justify-between">
              <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sugerencias:</span>
                <div className="flex flex-wrap gap-2">
                  {suggested.map((s, i) => (
                    <button
                      key={i}
                      className="bg-blue-50 text-[#0d4b6d] rounded-full px-4 py-1.5 text-xs hover:bg-blue-100 transition duration-200 border border-blue-100 shadow-sm"
                      onClick={() => setQuestion(s)}
                    >
                      {s}
                    </button>
                  ))}
                  <button className="bg-[#0d4b6d] text-white rounded-full p-1.5 hover:bg-[#0a3d59] transition duration-200 shadow-sm">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#0d4b6d] hover:bg-[#0a3d59] text-white font-medium px-6 py-3 rounded-xl transition duration-200 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Consultar datos</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {loading && (
            <div className="px-8 py-6 bg-blue-50 flex items-center space-x-3">
              <Loader2 className="text-[#0d4b6d] animate-spin" size={24} />
              <p className="text-[#0d4b6d]">Analizando tu consulta y procesando los datos...</p>
            </div>
          )}
          
          {/* Mostrar la tabla con los resultados cuando hay respuesta */}
          {response && response.success && (
            <div className="mt-2 px-8 pb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="text-[#0d4b6d]" size={20} />
                  <h2 className="text-lg font-semibold text-gray-800">Resultados de la consulta</h2>
                </div>
                
                {/* Botón de exportación a Excel */}
                {response.row_count > 0 && (
                  <button
                    onClick={() => exportToExcel(response.data, response.columns, `resultados_${new Date().toISOString().slice(0,10)}`)}
                    className="flex items-center gap-2 bg-[#0d4b6d] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#0a3d59] transition duration-200 shadow-sm"
                  >
                    <Download size={16} />
                    Exportar a CSV
                  </button>
                )}
              </div>
              
              {response.row_count > 0 ? (
                <>
                  <ResultTable data={response.data} columns={response.columns} />
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-[#0d4b6d]">{response.row_count}</span> registros encontrados
                    </p>
                    
                    <button 
                      onClick={() => {
                        const el = document.querySelector('.code-container');
                        el.classList.toggle('hidden');
                      }}
                      className="text-xs text-[#0d4b6d] hover:text-[#0a3d59] underline"
                    >
                      Ver consulta SQL
                    </button>
                  </div>
                  
                  <div className="code-container hidden mt-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Consulta SQL ejecutada:</p>
                    <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                      {response.query}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3 p-6 bg-blue-50 rounded-xl text-[#0d4b6d] border border-blue-100">
                  <AlertCircle size={24} className="text-[#0d4b6d]" />
                  <p>No se encontraron resultados para tu consulta.</p>
                </div>
              )}
            </div>
          )}
          
          {response && response.error && (
            <div className="px-8 pb-8">
              <div className="p-6 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
                <AlertCircle size={24} className="text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 mb-1">Error en la consulta</h3>
                  <p className="text-red-600 text-sm">{response.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroQuestionEngine;