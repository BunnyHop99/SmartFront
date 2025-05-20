import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import HeroQuestionEngine from './components/HeroQuestionEngine/HeroQuestionEngine'

function App() {
  // const [sql, setSql] = useState('');
  // SQL de prueba hardcodeado
  const [sql, setSql] = useState(`SELECT * FROM clientes WHERE importe > 1000;`);

  const handleQuestion = (questionText) => {
    // Simula la generación de SQL
    const fakeSQL = `SELECT * FROM ventas WHERE producto = 'productoX';`;
    setSql(fakeSQL);
  };
  
  return (
    <div className="min-h-screen font-sans">
      <Navbar/>
      <HeroQuestionEngine onQuestionSubmit={handleQuestion} />
    </div>
    
  )
}

export default App
