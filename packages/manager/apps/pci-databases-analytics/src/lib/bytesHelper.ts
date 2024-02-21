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

export function formatStorage(storage: Storage, decimals = 2) {
  let size = storage.value;
  let unitIndex = units.indexOf(storage.unit);

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${Number(Number(size).toFixed(decimals))} ${units[unitIndex]}`;
}
