import { describe, it, expect, vi } from 'vitest';
import {
  isFlexFlavorName,
  getFlexFlavorName,
  getBaseFlavorName,
  getFlexRegionalizedFlavorId,
  getBaseRegionalizedFlavorId,
  hasFlexVariant,
} from '../flavor.service';
import {
  TInstancesCatalog,
  TRegionalizedFlavor,
} from '@/domain/entities/instancesCatalog';
import { mockedInstancesCatalogEntity } from '@/__mocks__/instance/constants';

vi.mock('@/utils', () => ({
  getRegionalizedFlavorId: (flavorName: string, regionName: string) =>
    `${flavorName}_${regionName}`,
}));

function createMinimalCatalog(
  regionalizedFlavors: Array<{
    id: string;
    flavorId: string;
    regionId: string;
  }>,
): TInstancesCatalog {
  const byId = new Map<string, TRegionalizedFlavor>(
    regionalizedFlavors.map((rf) => [
      rf.id,
      {
        id: rf.id,
        flavorId: rf.flavorId,
        regionId: rf.regionId,
        hasStock: true,
        quota: 0,
        osTypes: ['linux'],
        tags: null,
      },
    ]),
  );
  return {
    ...mockedInstancesCatalogEntity,
    entities: {
      ...mockedInstancesCatalogEntity.entities,
      regionalizedFlavors: {
        byId,
        allIds: regionalizedFlavors.map((rf) => rf.id),
      },
    },
  };
}

describe('flavor.service – isFlexFlavorName', () => {
  it('returns true when name ends with -flex', () => {
    expect(isFlexFlavorName('b2-7-flex')).toBe(true);
    expect(isFlexFlavorName('d2-2-flex')).toBe(true);
  });
  it('returns false when name does not end with -flex', () => {
    expect(isFlexFlavorName('b2-7')).toBe(false);
    expect(isFlexFlavorName('d2-2')).toBe(false);
    expect(isFlexFlavorName('flex-b2')).toBe(false);
  });
});

describe('flavor.service – getFlexFlavorName', () => {
  it('appends -flex to base flavor name', () => {
    expect(getFlexFlavorName('b2-7')).toBe('b2-7-flex');
    expect(getFlexFlavorName('d2-2')).toBe('d2-2-flex');
  });
});

describe('flavor.service – getBaseFlavorName', () => {
  it('strips -flex suffix when present', () => {
    expect(getBaseFlavorName('b2-7-flex')).toBe('b2-7');
    expect(getBaseFlavorName('d2-2-flex')).toBe('d2-2');
  });
  it('leaves name unchanged when no -flex suffix', () => {
    expect(getBaseFlavorName('b2-7')).toBe('b2-7');
  });
});

describe('flavor.service – getFlexRegionalizedFlavorId', () => {
  it('returns flex id when flex variant exists in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
      { id: 'b2-7-flex_GRA11', flavorId: 'b2-7-flex', regionId: 'GRA11' },
    ]);
    expect(getFlexRegionalizedFlavorId(catalog, 'b2-7_GRA11')).toBe(
      'b2-7-flex_GRA11',
    );
  });
  it('returns same id when flavor is already flex', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7-flex_GRA11', flavorId: 'b2-7-flex', regionId: 'GRA11' },
    ]);
    expect(getFlexRegionalizedFlavorId(catalog, 'b2-7-flex_GRA11')).toBe(
      'b2-7-flex_GRA11',
    );
  });
  it('returns null when regionalized flavor is not in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
    ]);
    expect(getFlexRegionalizedFlavorId(catalog, 'unknown-id')).toBeNull();
  });
  it('returns null when flex variant is not in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
    ]);
    expect(getFlexRegionalizedFlavorId(catalog, 'b2-7_GRA11')).toBeNull();
  });
});

describe('flavor.service – getBaseRegionalizedFlavorId', () => {
  it('returns base id when flex variant exists in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
      { id: 'b2-7-flex_GRA11', flavorId: 'b2-7-flex', regionId: 'GRA11' },
    ]);
    expect(getBaseRegionalizedFlavorId(catalog, 'b2-7-flex_GRA11')).toBe(
      'b2-7_GRA11',
    );
  });
  it('returns same id when flavor is not flex', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
    ]);
    expect(getBaseRegionalizedFlavorId(catalog, 'b2-7_GRA11')).toBe(
      'b2-7_GRA11',
    );
  });
  it('returns null when regionalized flavor is not in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
    ]);
    expect(getBaseRegionalizedFlavorId(catalog, 'unknown-id')).toBeNull();
  });
  it('returns null when base variant is not in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7-flex_GRA11', flavorId: 'b2-7-flex', regionId: 'GRA11' },
    ]);
    expect(getBaseRegionalizedFlavorId(catalog, 'b2-7-flex_GRA11')).toBeNull();
  });
});

describe('flavor.service – hasFlexVariant', () => {
  it('returns true when flex variant exists in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
      { id: 'b2-7-flex_GRA11', flavorId: 'b2-7-flex', regionId: 'GRA11' },
    ]);
    expect(hasFlexVariant(catalog, 'b2-7_GRA11')).toBe(true);
  });
  it('returns true when regionalized flavor is already flex', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7-flex_GRA11', flavorId: 'b2-7-flex', regionId: 'GRA11' },
    ]);
    expect(hasFlexVariant(catalog, 'b2-7-flex_GRA11')).toBe(true);
  });
  it('returns false when catalog is undefined', () => {
    expect(hasFlexVariant(undefined, 'b2-7_GRA11')).toBe(false);
  });
  it('returns false when regionalizedFlavorId is null', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
    ]);
    expect(hasFlexVariant(catalog, null)).toBe(false);
  });
  it('returns false when flex variant does not exist in catalog', () => {
    const catalog = createMinimalCatalog([
      { id: 'b2-7_GRA11', flavorId: 'b2-7', regionId: 'GRA11' },
    ]);
    expect(hasFlexVariant(catalog, 'b2-7_GRA11')).toBe(false);
  });
});
