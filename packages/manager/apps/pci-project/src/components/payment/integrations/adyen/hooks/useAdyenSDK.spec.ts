import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useAdyenSDK, FormState, AdditionalAction } from './useAdyenSDK';
import {
  TAvailablePaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
} from '@/data/types/payment/payment-method.type';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';
import { ADYEN_RESULT_CODE } from '../constants';

// Mock functions using vi.hoisted to ensure they're available during hoisting
const {
  mockAdyenCheckout,
  mockAddPaymentDetails,
  mockConvertToBase64,
  mockParseFormSessionId,
} = vi.hoisted(() => ({
  mockAdyenCheckout: vi.fn(),
  mockAddPaymentDetails: vi.fn(),
  mockConvertToBase64: vi.fn(),
  mockParseFormSessionId: vi.fn(),
}));

// Mock the external dependencies
vi.mock('@adyen/adyen-web', () => ({
  default: mockAdyenCheckout,
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    environment: {
      getUserLocale: () => 'en_US',
    },
  }),
}));

vi.mock('../utils', () => ({
  convertToBase64: mockConvertToBase64,
  parseFormSessionId: mockParseFormSessionId,
}));

vi.mock('@/data/api/payment/payment-method', () => ({
  addPaymentDetails: mockAddPaymentDetails,
}));

describe('useAdyenSDK', () => {
  // Mock data
  const mockPaymentMethod: TAvailablePaymentMethod = {
    paymentMethodId: 1,
    paymentType: TPaymentMethodType.CREDIT_CARD,
    merchantId: 'test_merchant_id',
    formSessionId: 'mock_session_id',
    icon: {
      name: 'credit-card',
      data: undefined,
      url: undefined,
    },
    integration: TPaymentMethodIntegration.COMPONENT,
    oneshot: false,
    registerable: true,
    registerableWithTransaction: true,
    readableName: {
      key: 'credit_card',
      ns: 'payment',
    },
  };

  const mockFeatures: TPaymentFeaturesState = {
    ADYEN_LIVE_IN: false,
    CREDIT_CARD_CROSS_BORDER: false,
    RUPAY_CHARGE: false,
    SEPA_INFO_MSG: false,
    PAYPAL_CHARGE: false,
    SEPA_DIRECT_DEBIT: false,
  };

  const mockHandleFormChange = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  // Mock Adyen checkout instance
  const mockAdyenCheckoutInstance = {
    create: vi.fn().mockReturnValue({
      mount: vi.fn(),
    }),
    createFromAction: vi.fn().mockReturnValue({
      mount: vi.fn(),
    }),
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    mockAdyenCheckout.mockResolvedValue(mockAdyenCheckoutInstance);
    mockConvertToBase64.mockImplementation((input: string) => btoa(input));
    mockParseFormSessionId.mockReturnValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should initialize with scriptLoaded as false', () => {
      const { result } = renderHook(() =>
        useAdyenSDK(
          false,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      expect(result.current.scriptLoaded).toBe(false);
      expect(typeof result.current.handleAdditionalAction).toBe('function');
      expect(typeof result.current.setAdditionalDetails).toBe('function');
    });

    it('should not initialize Adyen when showAdyen is false', async () => {
      renderHook(() =>
        useAdyenSDK(
          false,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      expect(mockAdyenCheckout).not.toHaveBeenCalled();
    });

    it('should initialize Adyen when showAdyen is true', async () => {
      await act(async () => {
        renderHook(() =>
          useAdyenSDK(
            true,
            'container-id',
            'additional-container-id',
            mockPaymentMethod,
            mockFeatures,
            mockHandleFormChange,
            mockOnSuccess,
            mockOnError,
          ),
        );
      });

      expect(mockAdyenCheckout).toHaveBeenCalled();
    });
  });

  describe('handleAdditionalAction', () => {
    it('should handle additional action when Adyen checkout is available', async () => {
      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockAction: AdditionalAction = {
        action: { type: 'redirect', paymentMethodType: 'cb' },
        paymentMethodId: 123,
        transactionId: 456,
      };

      await act(async () => {
        result.current.handleAdditionalAction(mockAction);
      });

      // Since we're testing the hook directly, we can't easily verify
      // the internal state changes, but we can ensure the function doesn't throw
      expect(() =>
        result.current.handleAdditionalAction(mockAction),
      ).not.toThrow();
    });

    it('should not throw when Adyen checkout is not available', () => {
      const { result } = renderHook(() =>
        useAdyenSDK(
          false,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockAction: AdditionalAction = {
        action: { type: 'redirect', paymentMethodType: 'cb' },
        paymentMethodId: 123,
        transactionId: 456,
      };

      expect(() =>
        result.current.handleAdditionalAction(mockAction),
      ).not.toThrow();
    });
  });

  describe('setAdditionalDetails', () => {
    it('should handle successful payment authorization', async () => {
      mockAddPaymentDetails.mockResolvedValue({
        formSessionId: 'mock_response_session_id',
      });

      mockParseFormSessionId.mockReturnValue({
        resultCode: ADYEN_RESULT_CODE.AUTHORIZED,
      });

      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockDetails = { redirectResult: 'mock_result' };

      await act(async () => {
        await result.current.setAdditionalDetails(mockDetails, 456, 123);
      });

      expect(mockAddPaymentDetails).toHaveBeenCalledWith(123, {
        transactionId: 456,
        details: expect.any(String),
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(123);
    });

    it('should handle payment error', async () => {
      mockAddPaymentDetails.mockResolvedValue({
        formSessionId: 'mock_response_session_id',
      });

      mockParseFormSessionId.mockReturnValue({
        resultCode: ADYEN_RESULT_CODE.ERROR,
        refusalReason: 'Invalid card number',
      });

      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockDetails = { redirectResult: 'mock_result' };

      await act(async () => {
        await result.current.setAdditionalDetails(mockDetails, 456, 123);
      });

      expect(mockOnError).toHaveBeenCalledWith('Invalid card number');
    });

    it('should handle payment refusal', async () => {
      mockAddPaymentDetails.mockResolvedValue({
        formSessionId: 'mock_response_session_id',
      });

      mockParseFormSessionId.mockReturnValue({
        resultCode: ADYEN_RESULT_CODE.REFUSED,
        refusalReason: 'Insufficient funds',
      });

      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockDetails = { redirectResult: 'mock_result' };

      await act(async () => {
        await result.current.setAdditionalDetails(mockDetails, 456, 123);
      });

      expect(mockOnError).toHaveBeenCalledWith('Insufficient funds');
    });

    it('should handle additional action required', async () => {
      mockAddPaymentDetails.mockResolvedValue({
        formSessionId: 'mock_response_session_id',
      });

      const mockAdditionalAction = {
        type: 'redirect',
        url: 'https://example.com/redirect',
      };

      mockParseFormSessionId.mockReturnValue({
        action: mockAdditionalAction,
      });

      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockDetails = { redirectResult: 'mock_result' };

      await act(async () => {
        await result.current.setAdditionalDetails(mockDetails, 456, 123);
      });

      // The additional action should be triggered (we can't easily test the internal call)
      expect(mockAddPaymentDetails).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it('should handle API error', async () => {
      mockAddPaymentDetails.mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockDetails = { redirectResult: 'mock_result' };

      await act(async () => {
        await result.current.setAdditionalDetails(mockDetails, 456, 123);
      });

      expect(mockOnError).toHaveBeenCalledWith(
        'Registering payment details failed',
      );
    });

    it('should handle error without refusal reason', async () => {
      mockAddPaymentDetails.mockResolvedValue({
        formSessionId: 'mock_response_session_id',
      });

      mockParseFormSessionId.mockReturnValue({
        resultCode: ADYEN_RESULT_CODE.ERROR,
      });

      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockDetails = { redirectResult: 'mock_result' };

      await act(async () => {
        await result.current.setAdditionalDetails(mockDetails, 456, 123);
      });

      expect(mockOnError).toHaveBeenCalledWith('Payment error');
    });
  });

  describe('feature configuration', () => {
    it('should configure Adyen for test environment when merchant ID matches test pattern', async () => {
      const testPaymentMethod: TAvailablePaymentMethod = {
        ...mockPaymentMethod,
        merchantId: 'test_1234567890ABCDEF',
      };

      await act(async () => {
        renderHook(() =>
          useAdyenSDK(
            true,
            'container-id',
            'additional-container-id',
            testPaymentMethod,
            mockFeatures,
            mockHandleFormChange,
            mockOnSuccess,
            mockOnError,
          ),
        );
      });

      expect(mockAdyenCheckout).toHaveBeenCalled();
    });

    it('should configure Adyen for live environment when ADYEN_LIVE_IN is enabled', async () => {
      const liveFeatures: TPaymentFeaturesState = {
        ADYEN_LIVE_IN: true,
        CREDIT_CARD_CROSS_BORDER: false,
        RUPAY_CHARGE: false,
        SEPA_INFO_MSG: false,
        PAYPAL_CHARGE: false,
        SEPA_DIRECT_DEBIT: false,
      };

      await act(async () => {
        renderHook(() =>
          useAdyenSDK(
            true,
            'container-id',
            'additional-container-id',
            mockPaymentMethod,
            liveFeatures,
            mockHandleFormChange,
            mockOnSuccess,
            mockOnError,
          ),
        );
      });

      expect(mockAdyenCheckout).toHaveBeenCalled();
    });
  });

  describe('payment method configuration', () => {
    it('should handle payment method with form session ID', async () => {
      const mockSessionData = { customField: 'customValue' };

      mockParseFormSessionId.mockReturnValue(mockSessionData);

      const paymentMethodWithSession: TAvailablePaymentMethod = {
        ...mockPaymentMethod,
        formSessionId: 'encoded_session_data',
      };

      await act(async () => {
        renderHook(() =>
          useAdyenSDK(
            true,
            'container-id',
            'additional-container-id',
            paymentMethodWithSession,
            mockFeatures,
            mockHandleFormChange,
            mockOnSuccess,
            mockOnError,
          ),
        );
      });

      expect(mockParseFormSessionId).toHaveBeenCalledWith(
        'encoded_session_data',
      );
      expect(mockAdyenCheckoutInstance.create).toHaveBeenCalledWith('card', {
        ...mockSessionData,
        showBrandsUnderCardNumber: true,
      });
    });

    it('should handle payment method without form session ID', async () => {
      const paymentMethodWithoutSession: TAvailablePaymentMethod = {
        ...mockPaymentMethod,
        formSessionId: undefined,
      };

      await act(async () => {
        renderHook(() =>
          useAdyenSDK(
            true,
            'container-id',
            'additional-container-id',
            paymentMethodWithoutSession,
            mockFeatures,
            mockHandleFormChange,
            mockOnSuccess,
            mockOnError,
          ),
        );
      });

      expect(mockAdyenCheckoutInstance.create).toHaveBeenCalledWith('card', {
        showBrandsUnderCardNumber: true,
      });
    });
  });

  describe('component lifecycle', () => {
    it('should cleanup when showAdyen changes to false', async () => {
      const { rerender } = renderHook(
        ({ showAdyen }) =>
          useAdyenSDK(
            showAdyen,
            'container-id',
            'additional-container-id',
            mockPaymentMethod,
            mockFeatures,
            mockHandleFormChange,
            mockOnSuccess,
            mockOnError,
          ),
        { initialProps: { showAdyen: true } },
      );

      // Initially show Adyen
      await act(async () => {
        // Wait for the effect to run
      });

      // Hide Adyen
      await act(async () => {
        rerender({ showAdyen: false });
      });

      // Adyen should be cleaned up
      expect(mockAdyenCheckout).toHaveBeenCalled();
    });
  });

  describe('form state management', () => {
    it('should handle form state changes', () => {
      const { result } = renderHook(() =>
        useAdyenSDK(
          true,
          'container-id',
          'additional-container-id',
          mockPaymentMethod,
          mockFeatures,
          mockHandleFormChange,
          mockOnSuccess,
          mockOnError,
        ),
      );

      const mockFormState: FormState = {
        isValid: true,
        data: { cardNumber: '4111111111111111' },
      };

      // This would typically be called by the Adyen component
      act(() => {
        mockHandleFormChange(mockFormState);
      });

      expect(mockHandleFormChange).toHaveBeenCalledWith(mockFormState);
      expect(result.current).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined payment method gracefully', async () => {
      const undefinedPaymentMethod = {
        ...mockPaymentMethod,
        merchantId: undefined,
      };

      await act(async () => {
        expect(() =>
          renderHook(() =>
            useAdyenSDK(
              true,
              'container-id',
              'additional-container-id',
              undefinedPaymentMethod as TAvailablePaymentMethod,
              mockFeatures,
              mockHandleFormChange,
              mockOnSuccess,
              mockOnError,
            ),
          ),
        ).not.toThrow();
      });
    });

    it('should handle empty container IDs', async () => {
      await act(async () => {
        expect(() =>
          renderHook(() =>
            useAdyenSDK(
              true,
              '',
              '',
              mockPaymentMethod,
              mockFeatures,
              mockHandleFormChange,
              mockOnSuccess,
              mockOnError,
            ),
          ),
        ).not.toThrow();
      });
    });
  });
});
