import React, { useMemo, useState } from 'react';

const StructuralMeasurementsConverter = () => {
  const [inputValue, setInputValue] = useState('1000');
  const [inputUnitKey, setInputUnitKey] = useState('mm');
  const [areaValue, setAreaValue] = useState('100');
  const [areaFromUnit, setAreaFromUnit] = useState('sqm');

  const lengthUnits = [
    { key: 'mm', label: 'mm', toBase: 0.001 },
    { key: 'cm', label: 'cm', toBase: 0.01 },
    { key: 'm', label: 'm', toBase: 1 },
    { key: 'inch', label: 'inch', toBase: 0.0254 },
    { key: 'ft', label: 'ft', toBase: 0.3048 },
  ];

  const formatNumber = (value) => {
    if (value === null || !Number.isFinite(value)) return '';
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const formatFeetInches = (meters) => {
    if (meters === null || !Number.isFinite(meters)) return '';
    const totalFeet = meters / 0.3048;
    const feet = Math.floor(totalFeet);
    let inches = Math.round((totalFeet - feet) * 12);
    let adjFeet = feet;
    if (inches === 12) { adjFeet += 1; inches = 0; }
    return `${adjFeet}' ${inches}"`;
  };

  const { conversions, baseMeters } = useMemo(() => {
    const numeric = parseFloat(inputValue);
    if (isNaN(numeric)) return { baseMeters: null, conversions: lengthUnits.map(u => ({ unit: u, value: null })) };
    const fromUnit = lengthUnits.find((u) => u.key === inputUnitKey);
    const baseValue = numeric * fromUnit.toBase;
    return {
      baseMeters: baseValue,
      conversions: lengthUnits.map((unit) => ({ unit, value: baseValue / unit.toBase }))
    };
  }, [inputUnitKey, inputValue]);

  const areaResult = useMemo(() => {
    const numeric = parseFloat(areaValue);
    if (isNaN(numeric)) return '';
    const factor = 10.7639;
    return areaFromUnit === 'sqm' 
      ? (numeric * factor).toFixed(2) + ' sq.ft' 
      : (numeric / factor).toFixed(2) + ' sq.m';
  }, [areaValue, areaFromUnit]);

  // STYLES
  const cardStyle = { backgroundColor: '#fff', borderRadius: '12px', padding: '15px', marginBottom: '15px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
  const labelStyle = { fontSize: '10px', fontWeight: '900', color: '#64748b', marginBottom: '4px', display: 'block', textTransform: 'uppercase' };
  const outputBox = { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', marginBottom: '8px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '15px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      
      {/* HEADER */}
      <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', textAlign: 'center', borderBottom: '4px solid #3b82f6' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>STRUCTURAL CONVERTER</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', opacity: 0.8 }}>PRECISION ENGINEERING TOOL</p>
      </div>

      {/* INPUT SECTION */}
      <div style={{ ...cardStyle, borderLeft: '6px solid #3b82f6' }}>
        <span style={labelStyle}>Input Measurement</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} 
            style={{ flex: 1, padding: '12px', fontSize: '18px', fontWeight: '700', borderRadius: '8px', border: '2px solid #bfdbfe', backgroundColor: '#eff6ff', outline: 'none' }}
          />
          <select 
            value={inputUnitKey} onChange={(e) => setInputUnitKey(e.target.value)}
            style={{ width: '100px', padding: '12px', fontWeight: '700', borderRadius: '8px', border: '2px solid #cbd5e1', backgroundColor: '#fff' }}
          >
            {lengthUnits.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
          </select>
        </div>
      </div>

      {/* LENGTH OUTPUTS */}
      <div style={{ ...cardStyle, borderLeft: '6px solid #10b981' }}>
        <span style={labelStyle}>Metric & Imperial Length</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {conversions.map(({ unit, value }) => (
            <div key={unit.key} style={{ ...outputBox, backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <span style={{ fontSize: '9px', fontWeight: '900', color: '#059669' }}>{unit.label.toUpperCase()}</span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#064e3b' }}>{formatNumber(value)}</div>
            </div>
          ))}
          <div style={{ ...outputBox, backgroundColor: '#fffbeb', borderColor: '#fde68a', gridColumn: 'span 2' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', color: '#d97706' }}>FEET & INCHES (FORMATTED)</span>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#78350f' }}>{formatFeetInches(baseMeters)}</div>
          </div>
        </div>
      </div>

      {/* AREA CONVERTER */}
      <div style={{ ...cardStyle, borderLeft: '6px solid #8b5cf6' }}>
        <span style={labelStyle}>Area (Civil/Site)</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" value={areaValue} onChange={(e) => setAreaValue(e.target.value)} 
              style={{ flex: 1, padding: '10px', fontSize: '16px', fontWeight: '700', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <select 
              value={areaFromUnit} onChange={(e) => setAreaFromUnit(e.target.value)}
              style={{ width: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="sqm">sq.m (m²)</option>
              <option value="sqft">sq.ft (ft²)</option>
            </select>
          </div>
          <div style={{ backgroundColor: '#8b5cf6', color: '#fff', padding: '15px', borderRadius: '8px', textAlign: 'center', fontSize: '18px', fontWeight: '900' }}>
            RESULT: {areaResult}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: '700', color: '#94a3b8', marginTop: '10px' }}>
        STANDARD STRUCTURAL CONVERSION FACTORS APPLIED
      </div>
    </div>
  );
};

export default StructuralMeasurementsConverter;
