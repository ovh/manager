import { describe, it, vi, expect } from 'vitest';
import { TFunction } from 'i18next';
import useCategories from './useCategories';

const tMock = (vi.fn((key: string) => key) as unknown) as TFunction<
  'translation',
  undefined
>;

describe('useCategories.hook', () => {
  it('should return the correct categories', () => {
    const categories = ['category1', 'CATegory2'];
    const result = useCategories(tMock, categories);
    expect(result).toEqual('category_category1, category_category2');
  });
});
