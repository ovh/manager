import { getAutoGeneratedName, getNextAvailableVlanId } from './utils';

describe('getAutoGeneratedName', () => {
  it('should return auto generated name with prefix', () => {
    const result = getAutoGeneratedName('prefix');
    expect(result).toMatch(/^prefix-\d+-\d+$/);
  });

  it('should return auto generated name without prefix', () => {
    const result = getAutoGeneratedName();
    expect(result).toMatch(/^\d+-\d+$/);
  });
});

describe('getNextAvailableVlanId', () => {
  it.each([
    { allocatedIds: [1, 2, 100], expected: 3 },
    { allocatedIds: [1, 2, 3, 4, 1100], expected: 5 },
    { allocatedIds: [], expected: 1 },
  ])(
    'should return $expected from possible VLAN ID values when $allocatedIds are allocated ',
    ({ allocatedIds, expected }) => {
      expect(getNextAvailableVlanId(allocatedIds)).toBe(expected);
    },
  );
});