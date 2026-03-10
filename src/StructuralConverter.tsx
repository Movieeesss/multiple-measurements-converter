import React, { useMemo, useState } from 'react';

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
    if (value === null || isNaN(value) || !Number.isFinite(value)) return '0.00';
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  const formatFeetInches = (meters) => {
    if (!meters || isNaN(meters)) return '0\' 0"';
    const totalFeet = meters / 0.3048;
    const feet = Math.floor(totalFeet);
    let inches = Math.round((totalFeet - feet) * 12);
    let adjFeet = feet;
    if (inches === 12) { adjFeet += 1; inches = 0; }
    return `${adjFeet}' ${inches}"`;
  };

  const { filteredConversions, baseMetersValue } = useMemo(() => {
    const numeric = parseFloat(inputValue);
    if (isNaN(numeric)) return { baseMetersValue: 0, filteredConversions: [] };
    const fromUnit = lengthUnits.find((u) => u.key === inputUnitKey);
    const baseMeters = numeric * (fromUnit ? fromUnit.toBase : 0);
    const filtered = lengthUnits
      .filter(unit => unit.key !== inputUnitKey)
      .map((unit) => ({ unit, value: baseMeters / unit.toBase }));
    return { baseMetersValue: baseMeters, filteredConversions: filtered };
  }, [inputValue, inputUnitKey]);

  const areaDisplay = useMemo(() => {
    const numeric = parseFloat(areaValue);
    if (isNaN(numeric)) return '0.00';
    const factor = 10.7639;
    const result = areaFromUnit === 'sqm' ? (numeric * factor) : (numeric / factor);
    const unitLabel = areaFromUnit === 'sqm' ? 'ft²' : 'm²';
    return `${formatNumber(result)} ${unitLabel}`;
  }, [areaValue, areaFromUnit]);

  const containerStyle = { minHeight: '100vh', backgroundColor: '#f8fafc', padding: '15px', fontFamily: 'sans-serif', boxSizing: 'border-box' };
  const cardStyle = { backgroundColor: '#ffffff', borderRadius: '20px', padding: '18px', marginBottom: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', boxSizing: 'border-box' };
  
  return (
    <div style={containerStyle}>
      <div style={{ backgroundColor: '#1e293b', color: '#fff', padding: '20px 10px', borderRadius: '20px', marginBottom: '16px', textAlign: 'center', borderBottom: '4px solid #3b82f6' }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '900' }}>MMC TOOL</h1>
        <div style={{ display: 'inline-block', backgroundColor: '#3b82f6', padding: '2px 12px', borderRadius: '4px', marginTop: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>PRECISION ENGINEERING</span>
        </div>
      </div>

      <div style={{ ...cardStyle, borderLeft: '8px solid #3b82f6' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '8px', display: 'block' }}>INPUT MEASUREMENT</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{ flex: 1.5, padding: '14px', fontSize: '20px', fontWeight: '700', borderRadius: '12px', border: '2px solid #3b82f6', outline: 'none', width: '0' }} />
          <select value={inputUnitKey} onChange={(e) => setInputUnitKey(e.target.value)} style={{ flex: 1, padding: '14px', fontSize: '16px', fontWeight: '700', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
            {lengthUnits.map(u => <option key={u.key} value={u.key}>{u.key}</option>)}
          </select>
        </div>
      </div>

      <div style={{ ...cardStyle, borderLeft: '8px solid #10b981' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '12px', display: 'block' }}>LENGTH CONVERSIONS</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {filteredConversions.map(({ unit, value }) => (
            <div key={unit.key} style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '15px', border: '1px solid #dcfce7' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#059669' }}>{unit.label}</span>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#064e3b' }}>{formatNumber(value)}</div>
            </div>
          ))}
          <div style={{ gridColumn: 'span 2', backgroundColor: '#fffbeb', padding: '18px', borderRadius: '15px', textAlign: 'center', border: '1px solid #fef3c7' }}>
            <span style={{ fontSize: '10px', fontWeight: '900', color: '#92400e' }}>IMPERIAL FORMAT (FT & IN)</span>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#78350f' }}>{formatFeetInches(baseMetersValue)}</div>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, borderLeft: '8px solid #8b5cf6' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '12px', display: 'block' }}>AREA (CIVIL/SITE)</span>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <input type="number" value={areaValue} onChange={(e) => setAreaValue(e.target.value)} style={{ flex: 1.5, padding: '12px', fontSize: '18px', fontWeight: '700', borderRadius: '12px', border: '1px solid #e2e8f0', width: '0' }} />
          <select value={areaFromUnit} onChange={(e) => setAreaFromUnit(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <option value="sqm">Sq.m</option>
            <option value="sqft">Sq.ft</option>
          </select>
        </div>
        <div style={{ backgroundColor: '#8b5cf6', color: '#fff', padding: '18px', borderRadius: '15px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', display: 'block', opacity: 0.8 }}>CONVERTED AREA</span>
          <div style={{ fontSize: '24px', fontWeight: '900' }}>{areaDisplay}</div>
        </div>
      </div>
    </div>
  );
};

export default StructuralConverter;
