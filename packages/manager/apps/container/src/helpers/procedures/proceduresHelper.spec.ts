import { User } from '@ovh-ux/manager-config';
import {
    isIndiaProcedureToBeDone,
    isUserConcernedWithIndiaProcedure,
} from '@/helpers/procedures/proceduresHelper';
import { Procedure } from '@/types/procedure';

describe('proceduresHelpers', () => {

  describe('isUserConcernedWithIndiaProcedure', () => {
    it('should consider user not concerned by India procedure if their kyc is validated', () => {
      const user: Partial<User> = { kycValidated: true };
      expect(isUserConcernedWithIndiaProcedure(user as User)).toEqual(false);
    });

    it('should consider user concerned by India procedure if their kyc is not validated', () => {
      const user: Partial<User> = { kycValidated: false };
      expect(isUserConcernedWithIndiaProcedure(user as User)).toEqual(true);
    });
  });

  describe('isIndiaProcedureToBeDone', () => {
    it('should consider India procedure to be done if its status is \'required\'', () => {
      const procedure: Partial<Procedure> = { status: 'required' };
      expect(isIndiaProcedureToBeDone(procedure as Procedure)).toEqual(true);
    });
    
    it('should consider India procedure to be done if its status is \'open\'', () => {
      const procedure: Partial<Procedure> = { status: 'open' };
      expect(isIndiaProcedureToBeDone(procedure as Procedure)).toEqual(false);
    });
      
    it('should consider India procedure to be done if its status is \'ok\'', () => {
      const procedure: Partial<Procedure> = { status: 'ok' };
      expect(isIndiaProcedureToBeDone(procedure as Procedure)).toEqual(false);
    });
  });
});
