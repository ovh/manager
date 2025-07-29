import { isActionType } from '../../index';

describe('useOvhTracking', () => {
  describe('isActionType', () => {
    it('should return false if input is not an action type', () => {
      expect(isActionType('aaaa')).toBe(false);
    });

    it('should return true if input is an action type', () => {
      expect(isActionType('action')).toBe(false);
    });
  });
});
