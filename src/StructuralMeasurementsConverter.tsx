import React, { useMemo, useState } from 'react';

// NAMED EXPORT for main.tsx
export const StructuralConverter = () => {
  const [inputValue, setInputValue] = useState('1000');
  const [inputUnitKey, setInputUnitKey] = useState('mm');
  const [areaValue, setAreaValue] = useState('1200');
  const [areaFromUnit, setAreaFromUnit] = useState('sqft');

  const lengthUnits = [
    { key: 'mm', label: 'MM', toBase: 0.001 },
    { key: 'cm', label: 'CM', toBase: 0.01 },
    { key: 'm', label: 'M', toBase: 1 },
    { key: 'inch', label: 'INCH', toBase: 0.0254 },
    { key: 'ft', label: 'FT', toBase: 0.3048 },
  ];

  const formatNumber = (value) => {
    if (value === null || !Number.isFinite(value)) return '0.00';
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const formatFeetInches = (meters) => {
    if (meters === null || !Number.isFinite(meters)) return '0\' 0"';
    const totalFeet = meters / 0.3048;
    const feet = Math.floor(totalFeet);
    let inches = Math.round((totalFeet - feet) * 12);
    let adjFeet = feet;
    if (inches === 12) { adjFeet += 1; inches = 0; }
    return `${adjFeet}' ${inches}"`;
  };

  // LOGIC: Filter out the input unit from the conversions list to avoid repetition
  const { filteredConversions, baseMeters } = useMemo(() => {
    const numeric = parseFloat(inputValue);
    if (isNaN(numeric)) return { baseMeters: 0, filteredConversions: [] };
    
    const fromUnit = lengthUnits.find((u) => u.key === inputUnitKey);
    const baseValueInMeters = numeric * fromUnit.toBase;

    // We filter out the unit currently selected in the input select box
    const filtered = lengthUnits
      .filter(unit => unit.key !== inputUnitKey)
      .map((unit) => ({
        unit,
        value: baseValueInMeters / unit.toBase
      }));

    return { baseMeters: baseValueInMeters, filteredConversions: filtered };
  }, [inputValue, inputUnitKey]);

  const areaResultValue = useMemo(() => {
    const numeric = parseFloat(areaValue);
    if (isNaN(numeric)) return '0.00';
    const factor = 10.7639;
    return areaFromUnit === 'sqm' ? (numeric * factor).toFixed(2) : (numeric / factor).toFixed(2);
  }, [areaValue, areaFromUnit]);

  // STYLES
  const containerStyle = { minHeight: '100vh', backgroundColor: '#fcfcfc', padding: '12px', fontFamily: 'sans-serif' };
  const cardStyle = { backgroundColor: '#ffffff', borderRadius: '20px', padding: '16px', marginBottom: '16px', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };
  
  return (
    <div style={containerStyle}>
      
      {/* MMC TOOL HEADER */}
      <div style={{ backgroundColor: '#1a2233', color: '#fff', padding: '20px 10px', borderRadius: '20px', marginBottom: '16px', textAlign: 'center', borderBottom: '4px solid #3b82f6' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900', letterSpacing: '1px' }}>MMC TOOL</h1>
        <div style={{ display: 'inline-block', backgroundColor: '#3b82f6', padding: '2px 10px', borderRadius: '6px', marginTop: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>PRECISION ENGINEERING</span>
        </div>
      </div>

      {/* INPUT SECTION - BLUE */}
      <div style={{ ...cardStyle, borderLeft: '8px solid #3b82f6' }}>
        <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>INPUT MEASUREMENT</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} 
            style={{ flex: 1.5, padding: '14px', fontSize: '20px', fontWeight: '700', borderRadius: '12px', border: '2px solid #3b82f6', outline: 'none' }}
          />
          <select 
            value={inputUnitKey} onChange={(e) => setInputUnitKey(e.target.value)}
            style={{ flex: 1, padding: '14px', fontSize: '16px', fontWeight: '700', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}
          >
            {lengthUnits.map(u => <option key={u.key} value={u.key}>{u.key}</option>)}
          </select>
        </div>
      </div>

      {/* CONVERSIONS - GREEN */}
      <div style={{ ...cardStyle, borderLeft: '8px solid #10b981' }}>
        <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', marginBottom: '12px', display: 'block' }}>LENGTH CONVERSIONS</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {filteredConversions.map(({ unit, value }) => (
            <div key={unit.key} style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#059669' }}>{unit.label}</span>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#064e3b' }}>{formatNumber(value)}</div>
            </div>
          ))}
          {/* FEET & INCHES - GOLD */}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#fffbeb', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid #fef3c7', marginTop: '5px' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#92400e' }}>IMPERIAL FORMAT (FT & IN)</span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#78350f', marginTop: '4px' }}>{formatFeetInches(baseMeters)}</div>
          </div>
        </div>
      </div>

      {/* AREA SECTION - PURPLE */}
      <div style={{ ...cardStyle, borderLeft: '8px solid #8b5cf6' }}>
        <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', marginBottom: '12px', display: 'block' }}>AREA (CIVIL/SITE)</span>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <input 
            type="number" value={areaValue} onChange={(e) => setAreaValue(e.target.value)} 
            style={{ flex: 1.5, padding: '12px', fontSize: '18px', fontWeight: '700', borderRadius: '12px', border: '1px solid #e2e8f0' }}
          />
          <select 
            value={areaFromUnit} onChange={(e) => setAreaFromUnit(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px' }}
          >
            <option value="sqm">Sq.m (m²)</option>
            <option value="sqft">Sq.ft (ft²)</option>
          </select>
        </div>
        <div style={{ backgroundColor: '#8b5cf6', color: '#fff', padding: '18px', borderRadius: '15px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', display: 'block', opacity: 0.8, marginBottom: '2px' }}>CONVERTED AREA</span>
          <div style={{ fontSize: '24px', fontWeight: '900' }}>
            {formatNumber(parseFloat(areaResultValue))} {areaFromUnit === 'sqm' ? 'ft²' : 'm²'}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '10px', fontWeight: '700', marginTop: '10px', paddingBottom: '30px' }}>
        STANDARD STRUCTURAL CONVERSION FACTORS APPLIED
      </div>

    </div>
  );
};

export default StructuralConverter;
