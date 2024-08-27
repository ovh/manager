import { isValidSavingsPlanName } from './savingsPlan';

describe('isValidSavingsPlanName', () => {
  it('should return true for valid names', () => {
    expect(isValidSavingsPlanName('validName123')).toBe(true);
    expect(isValidSavingsPlanName('anotherValidName')).toBe(true);
    expect(isValidSavingsPlanName('123456')).toBe(true);
    expect(isValidSavingsPlanName('123_a-456')).toBe(true);
  });

  it('should return false for names with special characters', () => {
    expect(isValidSavingsPlanName('invalidName!')).toBe(false);
    expect(isValidSavingsPlanName('invalid@Name')).toBe(false);
    expect(isValidSavingsPlanName('invalid#Name')).toBe(false);
  });

  it('should return false for names with spaces', () => {
    expect(isValidSavingsPlanName('invalid name')).toBe(false);
    expect(isValidSavingsPlanName('another invalid name')).toBe(false);
  });

  it('should return false for empty names', () => {
    expect(isValidSavingsPlanName('')).toBe(false);
  });
});
