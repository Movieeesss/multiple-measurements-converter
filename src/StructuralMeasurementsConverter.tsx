import React, { useMemo, useState } from 'react';

type UnitKey = 'mm' | 'm' | 'cm' | 'inch' | 'ft' | 'MPa' | 'kg_cm2' | 'kN_m2' | 'psi' | 'psf' | 'kg' | 'tonne' | 'kN' | 'lb' | 'm3' | 'ft3' | 'L';

type Unit = { key: UnitKey; label: string; toBase: number; };
type UnitSetKey = 'length' | 'stress' | 'mass' | 'volume';
type UnitSet = { key: UnitSetKey; title: string; units: Unit[]; };

const lengthUnits: Unit[] = [
  { key: 'mm', label: 'mm', toBase: 0.001 },
  { key: 'cm', label: 'cm', toBase: 0.01 },
  { key: 'm', label: 'm', toBase: 1 },
  { key: 'inch', label: 'inch', toBase: 0.0254 },
  { key: 'ft', label: 'ft', toBase: 0.3048 },
];

const UNIT_SETS: UnitSet[] = [
  { key: 'length', title: 'Length & Site Dimensions', units: lengthUnits },
];

const formatNumber = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return '';
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 3,
    minimumFractionDigits: 2,
  });
};

const formatFeetInches = (meters: number | null): string => {
  if (meters === null || !Number.isFinite(meters)) return '';
  const totalFeet = meters / 0.3048;
  const feet = Math.floor(totalFeet);
  let inches = Math.round((totalFeet - feet) * 12);
  let adjFeet = feet;
  if (inches === 12) { adjFeet += 1; inches = 0; }
  return `${adjFeet}' ${inches}"`;
};

export const StructuralMeasurementsConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('1000');
  const [inputUnitKey, setInputUnitKey] = useState<UnitKey>('mm');
  const [areaValue, setAreaValue] = useState<string>('100');
  const [areaFromUnit, setAreaFromUnit] = useState<'sqm' | 'sqft'>('sqm');

  const activeSet = UNIT_SETS[0];

  const { conversions, baseMeters } = useMemo(() => {
    const numeric = parseFloat(inputValue);
    if (Number.isNaN(numeric)) return { baseMeters: null, conversions: activeSet.units.map(u => ({ unit: u, value: null })) };
    const fromUnit = activeSet.units.find((u) => u.key === inputUnitKey)!;
    const baseValue = numeric * fromUnit.toBase;
    return {
      baseMeters: baseValue,
      conversions: activeSet.units.map((unit) => ({ unit, value: baseValue / unit.toBase }))
    };
  }, [inputUnitKey, inputValue]);

  const areaConversions = useMemo(() => {
    const numeric = parseFloat(areaValue);
    if (Number.isNaN(numeric)) return { sqm: null, sqft: null };
    const factor = 10.7639; // More precise factor for structural use
    return areaFromUnit === 'sqm' 
      ? { sqm: numeric, sqft: numeric * factor } 
      : { sqm: numeric / factor, sqft: numeric };
  }, [areaValue, areaFromUnit]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-6 px-4 font-sans">
      <div className="w-full max-w-4xl space-y-4">
        
        {/* HEADER */}
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border-b-4 border-blue-500">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="bg-blue-500 p-1 rounded">🏗️</span> 
            STRUCTURAL CONVERTER
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase mt-1 tracking-widest">Precision Engineering Tool</p>
        </div>

        {/* INPUT BOX - BLUE THEME */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-black text-slate-800 uppercase">Input Measurement</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 text-lg font-bold text-blue-900 focus:border-blue-500 outline-none transition-all shadow-inner"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1 text-[10px] font-bold text-blue-400 uppercase">Value</span>
            </div>
            <select
              value={inputUnitKey}
              onChange={(e) => setInputUnitKey(e.target.value as UnitKey)}
              className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none"
            >
              {activeSet.units.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
            </select>
          </div>
        </div>

        {/* LENGTH OUTPUTS - GREEN THEME */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-emerald-500 rounded-full"></div>
              <h2 className="text-sm font-black text-slate-800 uppercase">Metric & Imperial Length</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {conversions.map(({ unit, value }) => (
              <div key={unit.key} className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] font-black text-emerald-600 uppercase mb-1">{unit.label}</span>
                <span className="text-lg font-bold text-emerald-900 font-mono tracking-tight">
                  {formatNumber(value)}
                </span>
              </div>
            ))}
            {/* SPECIAL FORMATTED BOX - AMBER THEME */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 flex flex-col col-span-2 sm:col-span-1 shadow-sm">
              <span className="text-[10px] font-black text-amber-600 uppercase mb-1">Feet & Inches</span>
              <span className="text-lg font-black text-amber-900">
                {formatFeetInches(baseMeters)}
              </span>
            </div>
          </div>
        </div>

        {/* AREA CONVERTER - PURPLE THEME */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-purple-600 rounded-full"></div>
              <h2 className="text-sm font-black text-slate-800 uppercase">Area (Civil/Site)</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="number"
              value={areaValue}
              onChange={(e) => setAreaValue(e.target.value)}
              className="bg-purple-50 border-2 border-purple-100 rounded-xl px-4 py-2 font-bold text-purple-900 outline-none focus:border-purple-500"
            />
            <select
              value={areaFromUnit}
              onChange={(e) => setAreaFromUnit(e.target.value as any)}
              className="bg-slate-100 border-2 border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none"
            >
              <option value="sqm">SQUARE METER (m²)</option>
              <option value="sqft">SQUARE FEET (ft²)</option>
            </select>
            <div className="flex items-center justify-center bg-purple-600 rounded-xl px-4 py-2 text-white font-black text-sm shadow-md">
              {areaFromUnit === 'sqm' ? `${formatNumber(areaConversions.sqft)} ft²` : `${formatNumber(areaConversions.sqm)} m²`}
            </div>
          </div>
        </div>

        {/* FOOTER FOOTNOTE */}
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Standard structural conversion factors applied</p>
        </div>

      </div>
    </div>
  );
};
