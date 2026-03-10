import React from 'react'
import ReactDOM from 'react-dom/client'
import { StructuralConverter } from './Structural-Measurements-Converter' // Updated named import
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StructuralConverter />
  </React.StrictMode>,
)



