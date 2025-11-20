import { filterFalsy } from './filterFalsy';

describe('filterFalsy', () => {
  it('should filter out all falsy values and keep truthy values', () => {
    const input = [1, false, null, undefined, 0, ''];
    const result = filterFalsy(input);
    expect(result).toEqual([1]);
  });

  it('should return an empty array when all values are falsy', () => {
    const input = [false, null, undefined, 0, ''];
    const result = filterFalsy(input);
    expect(result).toEqual([]);
  });

  it('should return the same array when there are no falsy values', () => {
    const input = [1, 2, 3, 4, 5];
    const result = filterFalsy(input);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return an empty array when given an empty array', () => {
    const input: (number | null | undefined | false)[] = [];
    const result = filterFalsy(input);
    expect(result).toEqual([]);
  });
});
