import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CurrencyCode } from '@ovh-ux/manager-react-components';
import { v6 } from '@ovh-ux/manager-core-api';
import { getEligibility } from './eligibility';
import {
  TEligibility,
  TEligibilityPaymentMethod,
  TEligibilityRequiredAction,
} from '@/data/types/payment/eligibility.type';

vi.mock('@ovh-ux/manager-core-api');

const mockV6 = vi.mocked(v6.get);

describe('eligibility API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEligibility', () => {
    it('should call the correct API endpoint', async () => {
      const mockEligibility: TEligibility = {
        actionsRequired: [],
        minimumCredit: null,
        paymentMethodsAuthorized: [TEligibilityPaymentMethod.CREDIT_CARD],
        voucher: null,
      };

      mockV6.mockResolvedValue({ data: mockEligibility });

      await getEligibility();

      expect(mockV6).toHaveBeenCalledWith('/cloud/eligibility');
    });

    it('should return eligibility data with required actions', async () => {
      const mockEligibility: TEligibility = {
        actionsRequired: [
          TEligibilityRequiredAction.ADD_PAYMENT_METHOD,
          TEligibilityRequiredAction.CHALLENGE_PAYMENT_METHOD,
        ],
        minimumCredit: {
          currencyCode: CurrencyCode.EUR,
          priceInUcents: 1000,
          text: '10.00 EUR',
          value: 10,
        },
        paymentMethodsAuthorized: [
          TEligibilityPaymentMethod.CREDIT_CARD,
          TEligibilityPaymentMethod.PAYPAL,
        ],
        voucher: {
          credit: {
            currencyCode: CurrencyCode.EUR,
            priceInUcents: 500,
            text: '5.00 EUR',
            value: 5,
          },
          paymentMethodRequired: true,
        },
      };

      mockV6.mockResolvedValue({ data: mockEligibility });

      const result = await getEligibility();

      expect(result).toEqual(mockEligibility);
    });

    it('should return eligibility data with minimal configuration', async () => {
      const mockEligibility: TEligibility = {
        actionsRequired: [],
        minimumCredit: null,
        paymentMethodsAuthorized: [],
        voucher: null,
      };

      mockV6.mockResolvedValue({ data: mockEligibility });

      const result = await getEligibility();

      expect(result).toEqual(mockEligibility);
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockV6.mockRejectedValue(mockError);

      await expect(getEligibility()).rejects.toThrow('API Error');
    });

    it('should return eligibility with all payment methods', async () => {
      const mockEligibility: TEligibility = {
        actionsRequired: [TEligibilityRequiredAction.VERIFY_PAYPAL],
        minimumCredit: {
          currencyCode: CurrencyCode.USD,
          priceInUcents: 2000,
          text: '20.00 USD',
          value: 20,
        },
        paymentMethodsAuthorized: [
          TEligibilityPaymentMethod.BANK_ACCOUNT,
          TEligibilityPaymentMethod.CREDIT,
          TEligibilityPaymentMethod.CREDIT_CARD,
          TEligibilityPaymentMethod.PAYPAL,
          TEligibilityPaymentMethod.RUPAY,
          TEligibilityPaymentMethod.SEPA_DIRECT_DEBIT,
        ],
        voucher: {
          credit: {
            currencyCode: CurrencyCode.points,
            priceInUcents: null,
            text: '100 points',
            value: 100,
          },
          paymentMethodRequired: false,
        },
      };

      mockV6.mockResolvedValue({ data: mockEligibility });

      const result = await getEligibility();

      expect(result).toEqual(mockEligibility);
      expect(result?.paymentMethodsAuthorized).toHaveLength(6);
    });
  });
});
