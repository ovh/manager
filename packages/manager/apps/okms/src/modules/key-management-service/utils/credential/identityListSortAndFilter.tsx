const safeStringify = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
};

export default function identityListSortAndFilter<T>(
  items: T[],
  sortKey: keyof T,
  searchTerm?: string,
  keys?: (keyof T)[],
): T[] {
  const sortedItems = [...items].sort((a, b) =>
    safeStringify(a[sortKey]).localeCompare(safeStringify(b[sortKey])),
  );

  if (!searchTerm || !keys) return sortedItems;

  return sortedItems.filter((item) =>
    keys.some((key) => safeStringify(item[key]).toLowerCase().includes(searchTerm.toLowerCase())),
  );
}
