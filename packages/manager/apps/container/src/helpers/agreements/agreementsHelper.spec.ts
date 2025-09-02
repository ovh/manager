import { hasPendingAgreements } from "@/helpers/agreements/agreementsHelper";
import { Agreements } from "@/types/agreements";

describe('agreementsHelper', () => {

  describe('hasPendingAgreements', () => {
    it('should consider there are no pending agreements if response is empty', () => {
      const response: Agreements[] = [];
      expect(hasPendingAgreements(response)).toEqual(false);
    });

    it('should consider there are pending agreements if response is not empty', () => {
      const response: Agreements[] = [{
        id: 1111,
        contractId: 2222,
        agreed: false,
        date: new Date(),
      }];
      expect(hasPendingAgreements(response)).toEqual(true);
    });
  });
});