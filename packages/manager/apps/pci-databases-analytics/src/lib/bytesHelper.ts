import i18next from 'i18next';

export interface Storage {
  unit: string;
  value: number;
}
const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

export function compareStorage(a: Storage, b: Storage) {
  const unitAIndex = units.indexOf(a.unit);
  const unitBIndex = units.indexOf(b.unit);

  if (unitAIndex < unitBIndex) {
    return -1;
  }
  if (unitAIndex > unitBIndex) {
    return 1;
  }
  return a.value - b.value;
}

export function addStorage(a: Storage, b: Storage): Storage {
  // Convert both storages to the unit with the highest index
  const maxUnitIndex = Math.max(units.indexOf(a.unit), units.indexOf(b.unit));
  const aValueInMaxUnit =
    a.value * 1000 ** (maxUnitIndex - units.indexOf(a.unit));
  const bValueInMaxUnit =
    b.value * 1000 ** (maxUnitIndex - units.indexOf(b.unit));

  // Perform addition
  const sumValue = aValueInMaxUnit + bValueInMaxUnit;

  // Find the appropriate unit
  const unit = units[maxUnitIndex];

  return {
    unit,
    value: sumValue,
  };
}

export function subtractStorage(a: Storage, b: Storage): Storage {
  // Convert both storages to the unit with the highest index
  const maxUnitIndex = Math.max(units.indexOf(a.unit), units.indexOf(b.unit));
  const aValueInMaxUnit =
    a.value * 1000 ** (maxUnitIndex - units.indexOf(a.unit));
  const bValueInMaxUnit =
    b.value * 1000 ** (maxUnitIndex - units.indexOf(b.unit));

  // Perform subtraction
  const diffValue = aValueInMaxUnit - bValueInMaxUnit;

  // Find the appropriate unit
  const unit = units[maxUnitIndex];

  return {
    unit,
    value: diffValue,
  };
}

export function formatStorage(
  storage: Storage,
  decimals = 2,
  useShortUnit = true,
) {
  let size = storage.value;
  let unitIndex = units.indexOf(storage.unit);

  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex += 1;
  }

  const unit = i18next.t(
    `unit${useShortUnit ? 'Short' : 'Long'}-${units[unitIndex]}`,
    { ns: 'bytes', count: size },
  );

  return `${Number(Number(size).toFixed(decimals))} ${unit}`;
}
