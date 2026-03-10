import React from 'react'
import ReactDOM from 'react-dom/client'
import { StructuralConverter } from './StructuralConverter' 

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <StructuralConverter />
    </React.StrictMode>
  );
}
