import { getDiffInPercent } from './Commitment.utils';

describe('getDiffInPercent', () => {
  it('should return the correct percentage difference when price1 is greater than price2', () => {
    expect(getDiffInPercent(200, 100)).toBe('50');
  });

  it('should return rounded percentage', () => {
    expect(getDiffInPercent(1386.29, 1056)).toBe('23');
  });

  it('should return null if theres is invalid price', () => {
    expect(getDiffInPercent(0, 51)).toBe(null);
  });

  it('should return null if theres is invalid price', () => {
    expect(getDiffInPercent(100, 0)).toBe(null);
  });
});
