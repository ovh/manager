export default function identityListSortAndFilter<T>(
  items: T[],
  sortKey: keyof T,
  searchTerm?: string,
  keys?: (keyof T)[],
): T[] {
  const sortedItems = [...items].sort((a, b) =>
    String(a[sortKey]).localeCompare(String(b[sortKey])),
  );

  if (!searchTerm || !keys) return sortedItems;

  return sortedItems.filter((item) =>
    keys.some((key) =>
      String(item[key])
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
  );
}
