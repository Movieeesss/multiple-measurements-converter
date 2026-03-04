import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { StructuralMeasurementsConverter } from './StructuralMeasurementsConverter';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <StructuralMeasurementsConverter />
  </React.StrictMode>,
);
