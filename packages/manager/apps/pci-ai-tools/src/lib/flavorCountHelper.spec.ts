import {
  buildFlavorResourcesInput,
  clampFlavorCount,
  getFlavorCount,
} from './flavorCountHelper';

describe('flavorCountHelper', () => {
  it('returns flavorCount first when present', () => {
    expect(
      getFlavorCount({
        flavorCount: 1,
        gpu: 4,
        cpu: 52,
      }),
    ).toBe(1);
  });

  it('falls back to gpu or cpu when flavorCount is missing', () => {
    expect(
      getFlavorCount({
        gpu: 2,
        cpu: 26,
      }),
    ).toBe(2);

    expect(
      getFlavorCount({
        gpu: 0,
        cpu: 3,
      }),
    ).toBe(3);
  });

  it('clamps quantity to the flavor max, including max = 1', () => {
    expect(clampFlavorCount(4, { max: 1 })).toBe(1);
    expect(clampFlavorCount(0, { max: 4 })).toBe(1);
  });

  it('builds the order payload with flavorCount', () => {
    expect(buildFlavorResourcesInput('h200-4-gpu', 1)).toStrictEqual({
      flavor: 'h200-4-gpu',
      flavorCount: 1,
    });
  });
});
