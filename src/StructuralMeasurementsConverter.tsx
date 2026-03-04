import React, { useMemo, useState } from 'react';

type UnitKey =
  | 'mm'
  | 'm'
  | 'cm'
  | 'inch'
  | 'ft'
  | 'yd'
  | 'MPa'
  | 'kg_cm2'
  | 'kN_m2'
  | 'psi'
  | 'psf'
  | 'kg'
  | 'tonne'
  | 'kN'
  | 'lb'
  | 'm3'
  | 'ft3'
  | 'L';

type Unit = {
  key: UnitKey;
  label: string;
  toBase: number;
};

type UnitSetKey = 'length' | 'stress' | 'mass' | 'volume';

type UnitSet = {
  key: UnitSetKey;
  title: string;
  units: Unit[];
};

// SET A: Length & Site Dimensions (base = meter)
const lengthUnits: Unit[] = [
  { key: 'mm', label: 'mm', toBase: 0.001 },
  { key: 'cm', label: 'cm', toBase: 0.01 },
  { key: 'm', label: 'm', toBase: 1 },
  { key: 'inch', label: 'inch', toBase: 0.0254 },
  { key: 'ft', label: 'ft', toBase: 0.3048 },
  // removed yard for cleaner length set
];

// SET B: Structural Force & Stress (base = MPa)
const stressUnits: Unit[] = [
  { key: 'MPa', label: 'MPa (N/mm²)', toBase: 1 },
  { key: 'kg_cm2', label: 'kg/cm²', toBase: 0.0980665 },
  { key: 'kN_m2', label: 'kN/m² (kPa)', toBase: 0.001 },
  { key: 'psi', label: 'psi', toBase: 0.006894757293168 },
  { key: 'psf', label: 'psf', toBase: 0.00004788025898 },
];

// SET C: Concrete & Steel Mass (base = kg)
const massUnits: Unit[] = [
  { key: 'kg', label: 'kg', toBase: 1 },
  { key: 'tonne', label: 'Metric tonne', toBase: 1000 },
  { key: 'kN', label: 'kN (weight)', toBase: 101.97162129779 },
  { key: 'lb', label: 'lbs', toBase: 0.45359237 },
];

// SET D: Volume (base = m³)
const volumeUnits: Unit[] = [
  { key: 'm3', label: 'Cu.m (m³)', toBase: 1 },
  { key: 'ft3', label: 'Cu.ft (CFT)', toBase: 0.028316846592 },
  { key: 'L', label: 'Litres', toBase: 0.001 },
];

const UNIT_SETS: UnitSet[] = [
  {
    key: 'length',
    title: 'Length & Site Dimensions',
    units: lengthUnits,
  },
];

const formatNumber = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) return '';
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};

const formatFeetInches = (meters: number | null): string => {
  if (meters === null || !Number.isFinite(meters)) return '';
  const totalFeet = meters / 0.3048;
  const feet = Math.floor(totalFeet);
  let inches = Math.round((totalFeet - feet) * 12);
  let adjFeet = feet;
  if (inches === 12) {
    adjFeet += 1;
    inches = 0;
  }
  return `${adjFeet}' ${inches}"`;
};

export const StructuralMeasurementsConverter: React.FC = () => {
  const [activeSetKey, setActiveSetKey] = useState<UnitSetKey>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [inputUnitKey, setInputUnitKey] = useState<UnitKey>('mm');
  const [areaValue, setAreaValue] = useState<string>('1200');
  const [areaFromUnit, setAreaFromUnit] = useState<'sqm' | 'sqft'>('sqft');

  const activeSet = useMemo(
    () => UNIT_SETS.find((s) => s.key === activeSetKey)!,
    [activeSetKey],
  );

  React.useEffect(() => {
    if (!activeSet.units.some((u) => u.key === inputUnitKey)) {
      setInputUnitKey(activeSet.units[0].key);
    }
  }, [activeSet, inputUnitKey]);

  const { conversions, baseMeters } = useMemo(() => {
    const numeric = parseFloat(inputValue);
    if (Number.isNaN(numeric)) {
      return {
        baseMeters: null as number | null,
        conversions: activeSet.units.map((u) => ({
          unit: u,
          value: null as number | null,
        })),
      };
    }

    const fromUnit = activeSet.units.find((u) => u.key === inputUnitKey)!;
    const baseValue = numeric * fromUnit.toBase;

    return {
      baseMeters: activeSet.key === 'length' ? baseValue : null,
      conversions: activeSet.units.map((unit) => ({
        unit,
        value: baseValue / unit.toBase,
      })),
    };
  }, [activeSet, inputUnitKey, inputValue]);

  const areaConversions = useMemo(() => {
    const numeric = parseFloat(areaValue);
    if (Number.isNaN(numeric)) {
      return { sqm: null as number | null, sqft: null as number | null };
    }

    // Use factor 10.76 as per your Excel example
    const factor = 10.76;
    if (areaFromUnit === 'sqm') {
      const sqm = numeric;
      const sqft = numeric * factor;
      return { sqm, sqft };
    }
    const sqft = numeric;
    const sqm = numeric / factor;
    return { sqm, sqft };
  }, [areaValue, areaFromUnit]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-10">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-3xl shadow-xl shadow-slate-200">
          <div className="border-b border-slate-200 px-6 pt-5 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Multiple Measurements Converter
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                MMC · Fast, accurate structural length & area conversions.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex h-6 items-center rounded-full border border-slate-200 px-3 bg-slate-50">
                Length focus
              </span>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70">
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-3 sm:gap-4 items-end">
              <div className="flex flex-col">
                <label
                  htmlFor="struct-input-value"
                  className="text-xs font-medium text-gray-700 mb-1"
                >
                  Input value
                </label>
                <input
                  id="struct-input-value"
                  type="number"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 outline-none"
                  placeholder="Enter value"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="struct-input-unit"
                  className="text-xs font-medium text-gray-700 mb-1"
                >
                  From unit
                </label>
                <div className="relative">
                  <select
                    id="struct-input-unit"
                    value={inputUnitKey}
                    onChange={(e) => setInputUnitKey(e.target.value as UnitKey)}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 outline-none appearance-none"
                  >
                    {activeSet.units.map((unit) => (
                      <option key={unit.key} value={unit.key}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M6 8l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Length outputs
                </p>
                <p className="text-[11px] text-slate-400">Updates while you type.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {conversions
                  .filter(({ unit }) => ['mm', 'm', 'ft'].includes(unit.key))
                  .map(({ unit, value }) => (
                    <div
                      key={unit.key}
                      className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                    >
                      <span className="text-xs font-medium text-slate-700 mb-1.5">
                        {unit.label}
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={formatNumber(value)}
                        className="block w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 shadow-inner focus:outline-none cursor-default"
                      />
                    </div>
                  ))}
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {conversions
                  .filter(({ unit }) => ['inch', 'cm'].includes(unit.key))
                  .map(({ unit, value }) => (
                    <div
                      key={unit.key}
                      className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                    >
                      <span className="text-xs font-medium text-slate-700 mb-1.5">
                        {unit.label}
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={formatNumber(value)}
                        className="block w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 shadow-inner focus:outline-none cursor-default"
                      />
                    </div>
                  ))}
                <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <span className="text-xs font-medium text-slate-700 mb-1.5">
                    Ft &amp; Inch (formatted)
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={formatFeetInches(baseMeters)}
                    className="block w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 shadow-inner focus:outline-none cursor-default"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Area converter (sq.m ↔ sq.ft)
                </p>
                <p className="text-[11px] text-slate-400">
                  Uses factor 1 m² = 10.76 ft².
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-3 sm:gap-4 items-end mb-3">
                <div className="flex flex-col">
                  <label
                    htmlFor="area-input"
                    className="text-xs font-medium text-slate-700 mb-1"
                  >
                    Area value
                  </label>
                  <input
                    id="area-input"
                    type="number"
                    inputMode="decimal"
                    value={areaValue}
                    onChange={(e) => setAreaValue(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 outline-none"
                    placeholder="Enter area"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="area-from-unit"
                    className="text-xs font-medium text-slate-700 mb-1"
                  >
                    From unit
                  </label>
                  <div className="relative">
                    <select
                      id="area-from-unit"
                      value={areaFromUnit}
                      onChange={(e) =>
                        setAreaFromUnit(e.target.value as 'sqm' | 'sqft')
                      }
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 outline-none appearance-none"
                    >
                      <option value="sqm">sq.m</option>
                      <option value="sqft">sq.ft</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <svg
                        className="h-4 w-4 text-slate-400"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M6 8l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <span className="text-xs font-medium text-slate-700 mb-1.5">
                    sq.m
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={formatNumber(areaConversions.sqm)}
                    className="block w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 shadow-inner focus:outline-none cursor-default"
                  />
                </div>
                <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <span className="text-xs font-medium text-slate-700 mb-1.5">
                    sq.ft
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={formatNumber(areaConversions.sqft)}
                    className="block w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 shadow-inner focus:outline-none cursor-default"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

