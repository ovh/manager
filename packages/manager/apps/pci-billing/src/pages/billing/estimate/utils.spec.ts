import { roundNumber, isValidEmail } from './utils';

describe('utils', () => {
  describe('roundNumber', () => {
    it('should round the number to 2 decimal places', () => {
      expect(roundNumber(1.2345)).toBe(1.23);
    });

    it('should round the number to 3 decimal places', () => {
      expect(roundNumber(1.2345, 3)).toBe(1.235);
    });
  });

  describe('isValidEmail', () => {
    it('should return false if email ns not valid', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should return true if email is valid', () => {
      expect(isValidEmail('ovh@ovh.com')).toBe(true);
    });
  });
});
