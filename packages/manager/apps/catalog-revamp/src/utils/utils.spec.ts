import { products as productsData } from './mocks/test-products.mock.json';
import {
  groupItemsByUniverse,
  getUniverses,
  filterProducts,
  Product,
  getAvailableCategories,
  filterByProperty,
  getAvailableCategoriesWithCounter,
  matchSearchText,
} from './utils';

describe('groupItemsByUniverse', () => {
  it('should group products by universe property', () => {
    const products: Product[] = productsData;

    const result = groupItemsByUniverse(products);

    const simplifiedResult = JSON.parse(JSON.stringify(result)); // avoid CI issues with snapshot
    expect(simplifiedResult).toMatchSnapshot();
  });
});

describe('filterProducts', () => {
  it('should filter products based on selected categories, universes, and search text', () => {
    const products: Product[] = productsData;

    const selectedCategories = ['Category1'];
    const selectedUniverses = ['Universe1'];
    const searchText = 'Product1';

    const filteredProducts = filterProducts(
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

    const universes = getUniverses(products, false);

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

describe('match categories with filterByProperty', () => {
  it('should match products based on selected categories', () => {
    const selectedCategories = ['Category1'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(
      filterByProperty(productToMatch, selectedCategories, 'category'),
    ).toBe(true);
  });

  it('should not match products based on selected categories', () => {
    const selectedCategories = ['Category1'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[1];

    expect(
      filterByProperty(productToMatch, selectedCategories, 'category'),
    ).toBe(false);
  });
});

describe('match universes with filterByProperty', () => {
  it('should match products based on selected universes', () => {
    const selectedUniverses = ['Universe2'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[2];

    expect(
      filterByProperty(productToMatch, selectedUniverses, 'universe'),
    ).toBe(true);
  });

  it('should not match products based on selected universes', () => {
    const selectedUniverses = ['Universe2'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(
      filterByProperty(productToMatch, selectedUniverses, 'universe'),
    ).toBe(false);
  });
});

describe('search product with matchSearchText', () => {
  it('should match products based on search Product1', () => {
    const searchText = 'Product1';
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(matchSearchText(productToMatch, searchText)).toBe(true);
  });

  it('should not match products based on search Product12345', () => {
    const searchText = 'Product12345';
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(matchSearchText(productToMatch, searchText)).toBe(false);
  });
});

describe('categories and universes with counters', () => {
  describe('getAvailableCategoriesWithCounter', () => {
    it('should return categories with their respective counts based on selected universes', () => {
      const result = getAvailableCategoriesWithCounter(productsData, [
        'Universe1',
      ]);
      expect(result).toEqual([
        { category: 'Category1', count: 1 },
        { category: 'Category2', count: 1 },
      ]);
    });
  });

  describe('getUniversesWithCounter', () => {
    it('should return universes with their respective counts', () => {
      const result = getUniverses(productsData, true);
      expect(result).toEqual([
        { universe: 'Universe1', count: 2 },
        { universe: 'Universe2', count: 2 },
      ]);
    });
  });
});
