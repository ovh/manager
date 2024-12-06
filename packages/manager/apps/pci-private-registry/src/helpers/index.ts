import { PaginationState } from '@ovh-ux/manager-react-components';

export const compareFunction = <T>(key: keyof T) => (a: T, b: T) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return aValue.toString().localeCompare(bValue.toString());
};

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

/**
 * Aggregates objects by a specified key, merging values from another key into an array
 * if there are multiple occurrences of the same key.
 *
 * @template T - The type of the input objects.
 * @param data - The input array of objects to be aggregated.
 * @param key - The property of `T` to group by. Must be a key of `T`.
 * @param lookupKey - The property of `T` whose values will be aggregated into arrays. Must be a key of `T`.
 * @returns - The aggregated array of objects.
 */
export const aggregateBySpecificKey = <T, K extends keyof T, L extends keyof T>(
  data: T[],
  key: K,
  lookupKey: L,
) => {
  const aggregated = data.reduce((acc, item) => {
    const groupKey = (item[key] as unknown) as string;

    if (!acc[groupKey]) {
      acc[groupKey] = { ...item, [lookupKey]: [] };
    }

    const valueArray = acc[groupKey][lookupKey] as T[L][];
    if (!valueArray.includes(item[lookupKey])) {
      valueArray.push(item[lookupKey]);
    }

    return acc;
  }, {} as Record<string, T & { [P in L]: T[L][] }>);

  return Object.values(aggregated).map((entry) => ({
    ...entry,
    [lookupKey]: entry[lookupKey],
  }));
};

type CategorizeResult<T> = {
  [key: string]: Array<T>;
};

/**
 * Categorizes an array of objects into multiple groups based on a specified key and allowed categories.
 *
 * @param data - The array of objects to categorize.
 * @param key - The key in the object that contains the categories (e.g., 'authorization').
 * @param categories - The list of categories to group objects by.
 * @param groupKey - The key from each object to include in the grouped result (e.g., 'ipBlock').
 * @returns An object where each category is a key, and its value is an array of objects containing the specified `groupKey`.
 *
 * @example
 * const data = [
 *   { ipBlock: '192.168.1.1', 'description': 'test1', authorization: ['management', 'registry'] },
 *   { ipBlock: '192.168.1.2', 'description': 'test2', authorization: ['management'] },
 *   { ipBlock: '192.168.1.3', 'description': 'test3', authorization: ['registry'] },
 * ];
 *
 * const result = categorizeByKey(data, 'authorization', ['management', 'registry'], 'ipBlock');
 * // Result:
 * // {
 * //   management: [{ ipBlock: '192.168.1.1', 'description': 'test1' }, { ipBlock: '192.168.1.2' }],
 * //   registry: [{ ipBlock: '192.168.1.1', 'description': 'test1' }, { ipBlock: '192.168.1.3' }]
 * // }
 */
export function categorizeByKey<T>(
  data: T[],
  key: keyof T,
  categories: string[],
): CategorizeResult<T> {
  const result: CategorizeResult<T> = categories.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as CategorizeResult<T>);

  data.forEach((item) => {
    const values = item[key];

    if (Array.isArray(values)) {
      values.forEach((value) => {
        if (categories.includes(value as string)) {
          const newItem = { ...item };
          delete newItem[key];
          result[value].push(newItem);
        }
      });
    }
  });

  return result;
}

export const isCidr = (value: string): boolean => {
  const cidrRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))$/;
  return cidrRegex.test(value);
};

export function isIp(value: string): boolean {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

  return ipv4Regex.test(value) || ipv6Regex.test(value);
}

export function capitalizeAndJoin(array) {
  const capitalizedArray = array.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  return capitalizedArray.join(', ');
}
