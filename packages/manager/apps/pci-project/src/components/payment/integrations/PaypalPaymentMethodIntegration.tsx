import { PAYPAL_BUTTON_OPTIONS, PAYPAL_SCRIPT } from '@/constants';
import { useFinalizePaymentMethod } from '@/data/hooks/payment/usePaymentMethods';
import { TCart } from '@/data/types/payment/cart.type';
import {
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface PaypalPaymentMethodIntegrationProps {
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  setAsDefault?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onPaymentSubmit: (skipRegistration?: boolean) => Promise<boolean | unknown>;
  handleValidityChange: (isValid: boolean) => void;
}

interface PaymentData {
  paymentMethodId: number;
  formSessionId: string;
}

interface PaypalPaymentMethodIntegrationConfig {
  payment: () => Promise<string>;
  onAuthorize: () => Promise<void>;
  onError: (error: Error) => void;
}

declare global {
  interface Window {
    paypal?: {
      Button: {
        render: (
          config: PaypalPaymentMethodIntegrationConfig,
          container: HTMLElement,
        ) => void;
      };
    };
  }
}

const PaypalPaymentMethodIntegration: React.FC<PaypalPaymentMethodIntegrationProps> = ({
  handleCustomSubmitButton,
  paymentHandler,
  onSuccess,
  onError,
  onPaymentSubmit,
  handleValidityChange,
}) => {
  // State only - no refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
  const [isButtonRendered, setIsButtonRendered] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  // API hooks
  const { mutateAsync: finalizePaymentMethod } = useFinalizePaymentMethod({
    onSuccess,
    onError,
  });

  const handlePayment = useCallback(async (): Promise<string> => {
    const result = await onPaymentSubmit(false);
    return `${result}`;
  }, [onPaymentSubmit, paymentData]);

  const handleAuthorize = useCallback(async () => {
    if (!paymentData) {
      throw new Error('Missing payment data');
    }

    await finalizePaymentMethod({
      paymentMethodId: paymentData.paymentMethodId,
      params: { formSessionId: paymentData.formSessionId },
    });

    // Call onPaymentSubmit with skipRegistration=true since registration was already done in handlePayment
    await onPaymentSubmit(true);
  }, [paymentData, finalizePaymentMethod, onPaymentSubmit]);

  const handleError = useCallback((error: Error) => onError?.(error), [
    onError,
  ]);

  // PayPal script loading
  useEffect(() => {
    const existingScript = document.getElementById(PAYPAL_SCRIPT.id);

    if (window.paypal && existingScript) {
      setIsPayPalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = PAYPAL_SCRIPT.id;
    script.src = PAYPAL_SCRIPT.src;
    script.async = true;
    script.onload = () => {
      window.paypal ? setIsPayPalLoaded(true) : setIsPayPalLoaded(false);
    };
    script.onerror = () => {
      setIsPayPalLoaded(false);
    };

    document.head.appendChild(script);
  }, []);

  // Render PayPal button when script is loaded
  useEffect(() => {
    if (
      isPayPalLoaded &&
      containerRef.current &&
      !isButtonRendered &&
      window.paypal?.Button
    ) {
      window.paypal.Button.render(
        {
          ...PAYPAL_BUTTON_OPTIONS,
          payment: handlePayment,
          onAuthorize: handleAuthorize,
          onError: handleError,
        },
        containerRef.current,
      );

      setIsButtonRendered(true);
    }
  }, [
    isPayPalLoaded,
    isButtonRendered,
    handlePayment,
    handleAuthorize,
    handleError,
  ]);

  useEffect(() => {
    if (handleCustomSubmitButton) {
      handleCustomSubmitButton(<div ref={containerRef} />);
    }
  }, []);

  useEffect(() => {
    handleValidityChange(true);
  }, [handleValidityChange]);

  useImperativeHandle(
    paymentHandler,
    () => {
      return {
        registerPaymentMethod: async (
          _paymentMethod: TPaymentMethod,
          _cart: TCart,
          registerPaymentMethod?: TRegisterPaymentMethod,
        ) => {
          if (
            !registerPaymentMethod?.formSessionId ||
            !registerPaymentMethod?.paymentMethodId
          ) {
            throw new Error('Missing Payment data');
          }

          setPaymentData({
            paymentMethodId: registerPaymentMethod.paymentMethodId,
            formSessionId: registerPaymentMethod.formSessionId,
          });

          return registerPaymentMethod.formSessionId;
        },
        onCheckoutRetrieved: async (_cart: TCart) => {
          return true;
        },
        onCartFinalized: async (_cart: TCart) => {
          return true;
        },
      };
    },
    [],
  );

  return null;
};

export default PaypalPaymentMethodIntegration;
