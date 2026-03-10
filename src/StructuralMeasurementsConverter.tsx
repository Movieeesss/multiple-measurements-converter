import React, { useMemo, useState } from 'react';

// Using a named export to match your main.tsx import requirement
export const StructuralConverter = () => {
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

  const { conversions, baseMeters } = useMemo(() => {
    const numeric = parseFloat(inputValue);
    if (isNaN(numeric)) return { baseMeters: 0, conversions: lengthUnits.map(u => ({ unit: u, value: 0 })) };
    const fromUnit = lengthUnits.find((u) => u.key === inputUnitKey);
    const baseValue = numeric * fromUnit.toBase;
    return {
      baseMeters: baseValue,
      conversions: lengthUnits.map((unit) => ({ unit, value: baseValue / unit.toBase }))
    };
  }, [inputUnitKey, inputValue]);

  const areaResultValue = useMemo(() => {
    const numeric = parseFloat(areaValue);
    if (isNaN(numeric)) return '0.00';
    const factor = 10.7639;
    return areaFromUnit === 'sqm' ? (numeric * factor).toFixed(2) : (numeric / factor).toFixed(2);
  }, [areaValue, areaFromUnit]);

  // STYLING OBJECTS
  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '15px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' };
  const cardStyle = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '18px', marginBottom: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' };
  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputStyle = { width: '100%', padding: '12px', fontSize: '20px', fontWeight: '700', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' };
  
  return (
    <div style={containerStyle}>
      
      {/* PROFESSIONAL HEADER - RENAMED */}
      <div style={{ backgroundColor: '#1e293b', color: '#fff', padding: '24px 15px', borderRadius: '16px', marginBottom: '16px', textAlign: 'center', borderBottom: '5px solid #3b82f6' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>STRUCTURAL CONVERTER</h1>
        <div style={{ display: 'inline-block', backgroundColor: '#3b82f6', padding: '2px 10px', borderRadius: '4px', marginTop: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>PRECISION ENGINEERING</span>
        </div>
      </div>

      {/* INPUT - BLUE THEME */}
      <div style={{ ...cardStyle, borderLeft: '8px solid #3b82f6' }}>
        <span style={labelStyle}>Input Measurement</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 2 }}>
            <input 
              type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} 
              style={{ ...inputStyle, backgroundColor: '#f0f7ff', borderColor: '#3b82f6' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <select 
              value={inputUnitKey} onChange={(e) => setInputUnitKey(e.target.value)}
              style={{ ...inputStyle, fontSize: '16px', backgroundColor: '#fff', cursor: 'pointer' }}
            >
              {lengthUnits.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* OUTPUTS - GREEN THEME */}
      <div style={{ ...cardStyle, borderLeft: '8px solid #10b981' }}>
        <span style={labelStyle}>Length Conversions</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {conversions.map(({ unit, value }) => (
            <div key={unit.key} style={{ backgroundColor: '#f0fdf4', border: '1px solid #bcf0da', padding: '12px', borderRadius: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#059669' }}>{unit.label.toUpperCase()}</span>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#064e3b' }}>{formatNumber(value)}</div>
            </div>
          ))}
          {/* SPECIAL FORMATTED BOX - ORANGE/GOLD THEME */}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#fffbeb', border: '2px solid #fde68a', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#d97706' }}>IMPERIAL FORMAT (FT & IN)</span>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#78350f', marginTop: '4px' }}>{formatFeetInches(baseMeters)}</div>
          </div>
        </div>
      </div>

      {/* AREA - PURPLE THEME */}
      <div style={{ ...cardStyle, borderLeft: '8px solid #8b5cf6' }}>
        <span style={labelStyle}>Area (Civil/Site)</span>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <input 
            type="number" value={areaValue} onChange={(e) => setAreaValue(e.target.value)} 
            style={{ ...inputStyle, flex: 2, fontSize: '18px' }}
          />
          <select 
            value={areaFromUnit} onChange={(e) => setAreaFromUnit(e.target.value)}
            style={{ ...inputStyle, flex: 1.5, fontSize: '14px' }}
          >
            <option value="sqm">Sq.m (m²)</option>
            <option value="sqft">Sq.ft (ft²)</option>
          </select>
        </div>
        <div style={{ backgroundColor: '#8b5cf6', color: '#fff', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', opacity: 0.9, display: 'block', marginBottom: '2px' }}>CONVERTED AREA</span>
          <div style={{ fontSize: '22px', fontWeight: '900' }}>
            {areaResultValue} {areaFromUnit === 'sqm' ? 'ft²' : 'm²'}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px' }}>
          1 m² = 10.7639 ft² · CONSTANT FACTORS APPLIED
        </p>
      </div>

    </div>
  );
};

// Updated default export
export default StructuralConverter;
