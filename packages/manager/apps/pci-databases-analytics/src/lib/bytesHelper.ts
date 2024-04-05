import i18next from 'i18next';

export interface Storage {
  unit: string;
  value: number;
}
const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

export function convertToBytes(storage: Storage): number {
  const unitIndex = units.indexOf(storage.unit);
  return storage.value * 1000 ** unitIndex;
}

export function compareStorage(a: Storage, b: Storage): number {
  // Convert both storage values to bytes
  const aValueInBytes = convertToBytes(a);
  const bValueInBytes = convertToBytes(b);

  // Compare the converted values
  if (aValueInBytes < bValueInBytes) {
    return -1;
  }

  if (aValueInBytes > bValueInBytes) {
    return 1;
  }
  return 0;
}

export function addStorage(a: Storage, b: Storage): Storage {
  // Convert both storages to bytes for accurate calculation
  const aValueInBytes = convertToBytes(a);
  const bValueInBytes = convertToBytes(b);

  // Perform addition in bytes
  let sumValueInBytes = aValueInBytes + bValueInBytes;

  // Determine the most appropriate unit for the result
  let resultUnitIndex = 0; // Start from the smallest unit ('B')
  while (sumValueInBytes >= 1000 && resultUnitIndex < units.length - 1) {
    sumValueInBytes /= 1000;
    resultUnitIndex += 1;
  }

  // Adjust the sum to a sensible precision to avoid floating point issues
  sumValueInBytes = parseFloat(sumValueInBytes.toFixed(3));

  // Construct the result with the adjusted unit
  return {
    unit: units[resultUnitIndex],
    value: sumValueInBytes,
  };
}

export function subtractStorage(a: Storage, b: Storage): Storage {
  // Convert both storages to bytes for accurate calculation
  const aValueInBytes = convertToBytes(a);
  const bValueInBytes = convertToBytes(b);

  // Perform subtraction in bytes
  let diffValueInBytes = aValueInBytes - bValueInBytes;

  // Determine the most appropriate unit for the result
  let resultUnitIndex = 0; // Start from the smallest unit ('B')
  while (diffValueInBytes >= 1000 && resultUnitIndex < units.length - 1) {
    diffValueInBytes /= 1000;
    resultUnitIndex += 1;
  }

  // Construct the result with the adjusted unit
  return {
    unit: units[resultUnitIndex],
    value: diffValueInBytes,
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
