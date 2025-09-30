import { describe, expect, it } from 'vitest';

import { Product } from '@/api';

import { products as productsData } from './mocks/test-products.mock.json';
import {
  filterByProperty,
  filterProducts,
  getAvailableCategoriesWithCounter,
  getFilterParamsFromUrl,
  getSearchUrlFromFilterParams,
  getUniverses,
  matchSearchText,
} from './utils';

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

describe('match categories with filterByProperty', () => {
  it('should match products based on selected categories', () => {
    const selectedCategories = ['Category1'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(filterByProperty(productToMatch, selectedCategories, 'category')).toBe(true);
  });

  it('should not match products based on selected categories', () => {
    const selectedCategories = ['Category1'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[1];

    expect(filterByProperty(productToMatch, selectedCategories, 'category')).toBe(false);
  });
});

describe('match universes with filterByProperty', () => {
  it('should match products based on selected universes', () => {
    const selectedUniverses = ['Universe2'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[2];

    expect(filterByProperty(productToMatch, selectedUniverses, 'universe')).toBe(true);
  });

  it('should not match products based on selected universes', () => {
    const selectedUniverses = ['Universe2'];
    const products: Product[] = productsData;
    const productToMatch: Product = products[0];

    expect(filterByProperty(productToMatch, selectedUniverses, 'universe')).toBe(false);
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
      const result = getAvailableCategoriesWithCounter(productsData, ['Universe1']);
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

describe('getFilterParamsFromUrl', () => {
  describe('get categories from url', () => {
    it('should return the categories match in params', () => {
      const result = getFilterParamsFromUrl(
        new URLSearchParams(
          'categories=AI+%26+machine+learning%2CContainers+and+orchestration%2CDedicated+Servers',
        ),
      );
      expect(result?.categories).toEqual([
        'AI & machine learning',
        'Containers and orchestration',
        'Dedicated Servers',
      ]);
    });
  });
  describe('get universes from url', () => {
    it('should return the universes match in params', () => {
      const result = getFilterParamsFromUrl(
        new URLSearchParams('universes=Bare+Metal+Cloud%2CHosted+Private+Cloud'),
      );
      expect(result?.universes).toEqual(['Bare Metal Cloud', 'Hosted Private Cloud']);
    });
  });
  describe('get categories and universes from url', () => {
    it('should return the categories match in params', () => {
      const result = getFilterParamsFromUrl(
        new URLSearchParams(
          'categories=AI+%26+machine+learning%2CContainers+and+orchestration%2CDedicated+Servers',
        ),
      );
      expect(result?.categories).toEqual([
        'AI & machine learning',
        'Containers and orchestration',
        'Dedicated Servers',
      ]);
    });
  });
  describe('get category and universe from url', () => {
    it('should return the universe and category match in params', () => {
      const result = getFilterParamsFromUrl(
        new URLSearchParams('categories=Containers+and+orchestration&universes=Bare+Metal+Cloud'),
      );
      expect(result?.universes).toEqual(['Bare Metal Cloud']);
      expect(result?.categories).toEqual(['Containers and orchestration']);
    });
  });
});

describe('getSearchUrlFromFilterParams', () => {
  describe('get params categories from url', () => {
    it('should return string with only categories ', () => {
      const result = getSearchUrlFromFilterParams(
        '',
        ['AI & machine learning', 'Containers and orchestration', 'Dedicated Servers'],
        [],
      );
      expect(result.toString()).toEqual(
        'categories=AI+%26+machine+learning%2CContainers+and+orchestration%2CDedicated+Servers',
      );
    });
  });
  describe('get params universes from url', () => {
    it('should return string with only universes ', () => {
      const result = getSearchUrlFromFilterParams(
        '',
        [],
        ['Bare Metal Cloud', 'Hosted Private Cloud'],
      );
      expect(result.toString()).toEqual('universes=Bare+Metal+Cloud%2CHosted+Private+Cloud');
    });
  });
  describe('get params query from url', () => {
    it('should return string with only query ', () => {
      const result = getSearchUrlFromFilterParams('cloud', [], []);
      expect(result.toString()).toEqual('q=cloud');
    });
  });
  describe('get params universes and category from url', () => {
    it('should return string with only universes ', () => {
      const result = getSearchUrlFromFilterParams(
        '',
        ['Containers and orchestration'],
        ['Bare Metal Cloud'],
      );
      expect(result.toString()).toEqual(
        'categories=Containers+and+orchestration&universes=Bare+Metal+Cloud',
      );
    });
  });
});
