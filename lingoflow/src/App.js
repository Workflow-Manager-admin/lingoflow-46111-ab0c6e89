import React from 'react';
import './App.css';
import TranslationUI from './TranslationUI';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      <nav className="navbar" role="navigation" aria-label="Main site navigation">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" aria-label="LingoFlow Logo Symbol" style={{color:'#4A90E2'}}>*</span> LingoFlow
            </div>
            <span style={{fontWeight: 500, fontSize: '1.02rem', letterSpacing: '.02em', color: '#50E3C2', alignSelf: 'center'}}>
              powered by KAVIA AI
            </span>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, width: '100%' }}>
        <TranslationUI />
      </main>
    </div>
  );
}

export default App;