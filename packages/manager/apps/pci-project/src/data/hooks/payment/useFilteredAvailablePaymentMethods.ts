import { useMemo } from 'react';
import {
  TAvailablePaymentMethod,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import { useAvailablePaymentMethods } from './useAvailablePaymentMethods';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import { camelToSnakeCase } from '@/utils/case-converter';
import {
  CREDIT_PAYMENT_METHOD,
  PREFERRED_PAYMENT_METHOD_ORDER,
} from '@/payment/constants';
import { TPaymentFeaturesState } from './usePaymentFeatureAvailabilities';

export const useFilteredAvailablePaymentMethods = (
  eligibility: TEligibility,
  features: TPaymentFeaturesState,
) => {
  const response = useAvailablePaymentMethods();

  const authorizedPaymentMethods = useMemo(
    () =>
      eligibility.paymentMethodsAuthorized.map((p) =>
        camelToSnakeCase(p).toUpperCase(),
      ),
    [eligibility.paymentMethodsAuthorized],
  );

  if (!response.data) {
    return response;
  }

  // Add credit as a payment method.
  // If the credit is not available, it will be filtered out later.
  const allPaymentMethods = [
    ...(response.data.data || []),
    CREDIT_PAYMENT_METHOD,
  ];

  // Filters payment methods based on authorization and feature availability.
  // This function checks two conditions:
  // 1. The payment method type must be included in the authorized payment methods list
  // 2. If the payment method is SEPA Direct Debit, the SEPA_DIRECT_DEBIT feature must be enabled
  const filterAllowedPaymentMethods = (method: TAvailablePaymentMethod) =>
    authorizedPaymentMethods.includes(method.paymentType) &&
    (method.paymentType !== TPaymentMethodType.SEPA_DIRECT_DEBIT ||
      features.SEPA_DIRECT_DEBIT);

  return {
    ...response,
    data: {
      ...response.data,
      data: allPaymentMethods
        .filter(filterAllowedPaymentMethods)
        .sort((a, b) => {
          const indexA = PREFERRED_PAYMENT_METHOD_ORDER.indexOf(a.paymentType);
          const indexB = PREFERRED_PAYMENT_METHOD_ORDER.indexOf(b.paymentType);
          return indexA - indexB;
        }),
    },
  };
};
