import { hasExpiredDefaultCreditCardAlert } from "@/helpers/paymentMethod/paymentMethodHelper";

describe('paymentMethodHelpers', () => {

  describe('hasExpiredDefaultCreditCardAlert', () => {
    it('should consider there is no expired credit card alert if response is null', () => {
      const response: string | null = null;
      expect(hasExpiredDefaultCreditCardAlert(response)).toEqual(false);
    });

    it('should consider there is an expired credit card alert if response is not null', () => {
      const response: string | null = 'expired';
      expect(hasExpiredDefaultCreditCardAlert(response)).toEqual(true);
    });
  });
});