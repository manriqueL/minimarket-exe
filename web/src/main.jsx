import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx'
import Footer from './componentes/footer/Footer.jsx'
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
