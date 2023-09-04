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

export const filterByEnum = (
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
    filterByEnum(product, selectedUniverses, 'universe'),
  );
  const uniqueCategories = [
    ...new Set(itemsFiltered.map((item) => item.category)),
  ];
  return uniqueCategories.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
};

export const matchCategories = (
  product: Product,
  selectedCategories: string[],
) => {
  return filterByEnum(product, selectedCategories, 'category');
};

export const matchUniverses = (
  product: Product,
  selectedUniverses: string[],
) => {
  return filterByEnum(product, selectedUniverses, 'universe');
};

export const matchSearchText = (product: Product, searchText: string) => {
  const search = searchText && searchText.toLowerCase();
  return (
    !search ||
    product.category.toLowerCase().includes(search) ||
    product.universe.toLowerCase().includes(search) ||
    product.name.toLowerCase().includes(search)
  );
};

export const filterItems = (
  products: Product[],
  selectedCategories: string[],
  selectedUniverses: string[],
  searchText: string,
) => {
  return products.filter(
    (product) =>
      matchCategories(product, selectedCategories) &&
      matchUniverses(product, selectedUniverses) &&
      matchSearchText(product, searchText),
  );
};

export const getUniverses = (products: Product[]) => {
  const uniqueUniverses = [
    ...new Set(products.map((product) => product.universe)),
  ];
  return uniqueUniverses.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  );
};
