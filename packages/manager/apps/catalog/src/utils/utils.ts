export type Product = {
  id: number;
  name: string;
  description: string;
  lang: string;
  categories: string[];
  url: string;
  regionTags: string[];
  productName: string;
  order: string;
  universe: string;
  category: string;
};

type ProductKey = 'universe' | 'category' | 'name';

export const groupItemsByUniverse = (itemsToGroup: Product[]) => {
  return itemsToGroup.reduce<Record<string, Product[]>>((acc, item) => {
    if (!acc[item.universe]) acc[item.universe] = [];
    acc[item.universe].push(item);
    return acc;
  }, {});
};

export const filterByProperty = (
  product: Product,
  query: string[],
  property: ProductKey,
) => {
  return query.length === 0 || query.includes(product[property]);
};

export const getAvailableCategories = (
  products: Product[],
  selectedUniverses: string[],
) => {
  const itemsFiltered = products.filter((product) =>
    filterByProperty(product, selectedUniverses, 'universe'),
  );
  const uniqueCategories = [
    ...new Set(itemsFiltered.map((item) => item.category)),
  ];
  return uniqueCategories.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
};

export const matchSearchText = (product: Product, searchText: string) => {
  const search = searchText?.toLowerCase();
  return (
    !search ||
    product.category.toLowerCase().includes(search) ||
    product.universe.toLowerCase().includes(search) ||
    product.description.toLowerCase().includes(search) ||
    product.name.toLowerCase().includes(search)
  );
};

export const filterProducts = (
  products: Product[],
  selectedCategories: string[],
  selectedUniverses: string[],
  searchText: string,
) => {
  return products.filter(
    (product) =>
      filterByProperty(product, selectedCategories, 'category') &&
      filterByProperty(product, selectedUniverses, 'universe') &&
      matchSearchText(product, searchText),
  );
};

const countAndFormat = (objectList: any[], property: string) => {
  const countByProperty = objectList.reduce((acc, obj) => {
    acc[obj[property]] = (acc[obj[property]] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(countByProperty)
    .map(([key, count]) => ({ [property]: key, count }))
    .sort((a, b) =>
      (a[property] as string).localeCompare(b[property] as string, undefined, {
        sensitivity: 'base',
      }),
    );
};

export function getUniverses<T extends boolean>(
  products: Product[],
  withCounter: T,
): T extends true ? { universe: string; count: number }[] : string[] {
  if (withCounter) {
    const formattedUniverses = countAndFormat(products, 'universe') as {
      universe: string;
      count: number;
    }[];
    formattedUniverses.sort((a, b) =>
      a.universe.localeCompare(b.universe, undefined, { sensitivity: 'base' }),
    );
    return formattedUniverses as any;
  }
  const uniqueUniverses = [
    ...new Set(products.map((product) => product.universe)),
  ];

  uniqueUniverses.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
  return uniqueUniverses as any;
}

export const getAvailableCategoriesWithCounter = (
  products: Product[],
  selectedUniverses: string[],
) => {
  const productsInSelectedUniverses = products.filter((product) =>
    filterByProperty(product, selectedUniverses, 'universe'),
  );

  return countAndFormat(productsInSelectedUniverses, 'category');
};

export const getFilterParamsFromUrl = (
  search: string,
): { universes: string[]; categories: string[] } => {
  const params = new URLSearchParams(search);
  const universesURL = params.get('universes');
  const categoriesURL = params.get('categories');
  const universes = universesURL ? universesURL.split(',') : [];
  const categories = categoriesURL ? categoriesURL.split(',') : [];
  return { universes, categories };
};

export const getSearchUrlFromFilterParams = (
  search: string,
  categories: string[],
  universes: string[],
): string => {
  const params = new URLSearchParams();
  if (search) params.append('q', search);
  if (categories.length > 0) params.append('categories', categories.join(','));
  if (universes.length > 0) params.append('universes', universes.join(','));
  return params.toString();
};
