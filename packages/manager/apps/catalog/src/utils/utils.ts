import { Product } from '@/api';

type ProductKey = 'universe' | 'category' | 'name';

export const toFilterDisplay = (label: string) => label.replaceAll('_', ' ');

export const toFilterValue = (label: string) => label.replace(/,/gm, '{coma}').replace(/\s/gm, '_');

export const toFilterLabel = (value: string) =>
  value.replace(/_/gm, ' ').replace(/\{coma\}/gm, ',');

export interface Universe {
  universe: string;
  count: number;
  category?: string;
  name?: string;
}

export const filterByProperty = (product: Product, query: string[], property: ProductKey) => {
  return query.length === 0 || query.includes(product[property]);
};

export const matchSearchText = (product: Product, searchText: string) => {
  const search = searchText?.toLowerCase();
  return (
    !search ||
    product.category?.toLowerCase().includes(search) ||
    product.universe?.toLowerCase().includes(search) ||
    product.description?.toLowerCase().includes(search) ||
    product.name?.toLowerCase().includes(search)
  );
};

export const filterProducts = (
  products: Product[],
  selectedCategories: string[],
  selectedUniverses: string[],
  searchText: string,
) =>
  products.filter(
    (product) =>
      filterByProperty(product, selectedCategories.map(toFilterLabel), 'category') &&
      filterByProperty(product, selectedUniverses.map(toFilterLabel), 'universe') &&
      matchSearchText(product, searchText),
  );

const countAndFormat = (objectList: Product[], property: ProductKey) => {
  const countByProperty = objectList.reduce(
    (acc: { [key in string]: number }, obj: Product) => {
      acc[obj[property]] = (acc[obj[property]] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(countByProperty)
    .map(([key, count]) => ({ [property]: key, count }))
    .sort((a, b) =>
      (a[property] as string).localeCompare(b[property] as string, undefined, {
        sensitivity: 'base',
      }),
    );
};

export function getUniverses(products: Product[], withCounter: boolean) {
  if (withCounter) {
    const formattedUniverses = countAndFormat(products, 'universe') as {
      universe: string;
      count: number;
    }[];
    formattedUniverses.sort((a, b) =>
      a.universe.localeCompare(b.universe, undefined, { sensitivity: 'base' }),
    );
    return formattedUniverses;
  }
  const uniqueUniverses = [...new Set(products.map((product) => product.universe))];

  uniqueUniverses.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  return uniqueUniverses;
}

export const getAvailableCategoriesWithCounter = (
  products: Product[],
  selectedUniverses: string[],
) => {
  const productsInSelectedUniverses = products
    .filter((product) => filterByProperty(product, selectedUniverses, 'universe'))
    .filter((product) => !!product.category);
  return countAndFormat(productsInSelectedUniverses, 'category');
};

export const getFilterParamsFromUrl = (
  search: URLSearchParams,
): { universes: string[]; categories: string[] } => {
  const universesURL = search.get('universes');
  const categoriesURL = search.get('categories');
  const universes = universesURL ? universesURL.split(',') : [];
  const categories = categoriesURL ? categoriesURL.split(',') : [];
  return { universes, categories };
};

export const getSearchUrlFromFilterParams = (
  search: string,
  categories: string[],
  universes: string[],
): URLSearchParams => {
  const params = new URLSearchParams();
  if (search) params.append('q', search);
  if (categories.length > 0) params.append('categories', categories.join(','));
  if (universes.length > 0) params.append('universes', universes.join(','));
  return params;
};
