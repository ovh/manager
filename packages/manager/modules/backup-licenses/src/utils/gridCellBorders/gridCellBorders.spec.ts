import { describe, expect, it } from 'vitest';

import { getTwoColumnCellBorders } from './gridCellBorders';

describe('getTwoColumnCellBorders', () => {
  it.each([
    [0, 'border-b sm:border-r'],
    [1, 'border-b'],
    [2, 'border-b sm:border-b-0 sm:border-r'],
    [3, 'sm:border-b-0'],
  ])('describes the borders of cell %i of a 2x2 grid', (index, expected) => {
    expect(getTwoColumnCellBorders(index, 4)).toBe(
      `border-0 border-solid border-[var(--ods-color-neutral-100)] ${expected}`,
    );
  });

  it('leaves a single cell without any separator', () => {
    expect(getTwoColumnCellBorders(0, 1)).toBe(
      'border-0 border-solid border-[var(--ods-color-neutral-100)] sm:border-b-0',
    );
  });

  it('does not add a vertical separator to the last cell of an odd grid', () => {
    expect(getTwoColumnCellBorders(2, 3)).toBe(
      'border-0 border-solid border-[var(--ods-color-neutral-100)] sm:border-b-0',
    );
  });
});
