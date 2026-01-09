import { describe, it } from 'vitest';
import {
  mockedFlavorCategoriesSelectorData,
  mockedFlavorTypesSelectorData,
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectCategories, selectTypes } from '../categoriesTypesViewModel';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  instancePort: {
    createInstance: vi.fn(),
  },
};

describe('selectCategories ViewModel', () => {
  it('should return expected categories for the flavor categories options', () => {
    expect(selectCategories(fakeDeps)(mockedProjectId)).toStrictEqual(
      mockedFlavorCategoriesSelectorData,
    );
  });
});

describe('selectTypes ViewModel', () => {
  it('should return expected types  for the flavor types options', () => {
    const categories = selectCategories(fakeDeps)(mockedProjectId);

    expect(
      selectTypes(fakeDeps)(mockedProjectId, categories[0]?.name ?? null),
    ).toStrictEqual(mockedFlavorTypesSelectorData);
  });
});
