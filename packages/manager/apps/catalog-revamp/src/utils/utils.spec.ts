import { products as productsData } from './test-products.mock.json';
import {
  groupItemsByUniverse,
  getUniverses,
  filterItems,
  Product,
  getAvailableCategories,
  matchCategories,
  matchUniverses,
} from './utils';

describe('groupItemsByUniverse', () => {
  it('should group products by universe property', () => {
    const products: Product[] = productsData;

    const result = groupItemsByUniverse(products);

    expect(result).toMatchSnapshot();
  });
});

describe('filterItems', () => {
  it('should filter products based on selected categories, universes, and search text', () => {
    const products: Product[] = productsData;

    const selectedCategories = ['Category1'];
    const selectedUniverses = ['Universe1'];
    const searchText = 'Product1';

    const filteredProducts = filterItems(
      products,
      selectedCategories,
      selectedUniverses,
      searchText,
    );

    expect(filteredProducts).toEqual([
      {
        categories: ['Cat1'],
        category: 'Category1',
        description: 'Description1',
        id: 1,
        lang: 'EN',
        name: 'Product1',
        order: 'Order1',
        productName: 'ProductName1',
        regionTags: ['Region1'],
        universe: 'Universe1',
        url: 'http://example.com/1',
      },
    ]);
  });
});

describe('getUniverses', () => {
  it('should return unique universes from products', () => {
    const products: Product[] = productsData;

    const universes = getUniverses(products);

    expect(universes).toEqual(['Universe1', 'Universe2']);
  });
});

describe('getAvailableCategories', () => {
  it('should return unique categories based on selected universes', () => {
    const products: Product[] = productsData;
    const selectedUniverses = ['Universe1'];
    const categories = getAvailableCategories(products, selectedUniverses);

    expect(categories).toEqual(['Category1', 'Category2']);
  });
});

describe('matchCategories', () => {
  it('should match products based on selected categories', () => {
    const selectedCategories = ['Category1'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(matchCategories(productToMatch, selectedCategories)).toBe(true);
  });

  it('should not match products based on selected categories', () => {
    const selectedCategories = ['Category1'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[1];

    expect(matchCategories(productToMatch, selectedCategories)).toBe(false);
  });
});

describe('matchUniverses', () => {
  it('should match products based on selected universes', () => {
    const selectedUniverses = ['Universe2'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[2];

    expect(matchUniverses(productToMatch, selectedUniverses)).toBe(true);
  });

  it('should not match products based on selected universes', () => {
    const selectedUniverses = ['Universe2'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(matchUniverses(productToMatch, selectedUniverses)).toBe(false);
  });
});
