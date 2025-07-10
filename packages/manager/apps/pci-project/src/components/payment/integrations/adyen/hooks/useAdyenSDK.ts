import AdyenCheckout from '@adyen/adyen-web';
import { CoreOptions } from '@adyen/adyen-web/dist/types/core/types';
import { PaymentAction } from '@adyen/adyen-web/dist/types/types';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Core from '@adyen/adyen-web/dist/types/core/core';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ADYEN_CONFIG,
  ADYEN_RESULT_CODE,
  PAYMENT_METHOD_BRANDS,
} from '../constants';
import { TAvailablePaymentMethod } from '@/data/types/payment/payment-method.type';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';
import { convertToBase64, parseFormSessionId } from '../utils';
import '../styles/index.less';
import { addPaymentDetails } from '@/data/api/payment/payment-method';

interface UseAdyenSDKReturn {
  scriptLoaded: boolean;
  handleAdditionalAction: (action: AdditionalAction) => void;
  setAdditionalDetails: (
    details: Record<string, unknown>,
    currTransactionId: number,
    currPaymentMethodId: number,
  ) => void;
}

export type FormState = {
  isValid: boolean;
  data: Record<string, unknown>;
};

type AdditionalDetailState = {
  data: {
    details: Record<string, unknown>;
  };
};

export type AdditionalAction = {
  action: PaymentAction;
  paymentMethodId: number;
  transactionId: number;
};

const getAdyenConf = (
  paymentMethod: TAvailablePaymentMethod,
  locale: string,
  features: TPaymentFeaturesState,
  handleFormChange: (state: FormState) => void,
  handleAdditionalDetails: (state: AdditionalDetailState) => void,
): CoreOptions => {
  if (Object.keys(PAYMENT_METHOD_BRANDS).includes(paymentMethod.paymentType)) {
    Object.assign(
      ADYEN_CONFIG.DEFAULT.paymentMethodsResponse.paymentMethods[0],
      {
        brands:
          PAYMENT_METHOD_BRANDS[
            paymentMethod.paymentType as keyof typeof PAYMENT_METHOD_BRANDS
          ],
      },
    );
  }

  const adyenEnvironment = features.ADYEN_LIVE_IN
    ? ADYEN_CONFIG.ENV_ENUM.LIVE_IN
    : ADYEN_CONFIG.ENV_ENUM.LIVE;

  return {
    onChange: handleFormChange,
    onAdditionalDetails: handleAdditionalDetails,
    ...ADYEN_CONFIG.DEFAULT,
    clientKey: paymentMethod.merchantId,
    locale,
    environment: ADYEN_CONFIG.CLIENT_KEY_ENV_PATTERNS.test(
      paymentMethod.merchantId || '',
    )
      ? ADYEN_CONFIG.ENV_ENUM.TEST
      : adyenEnvironment,
  };
};

export const useAdyenSDK = (
  showAdyen: boolean,
  containerId: string,
  additionalContainerId: string,
  paymentMethod: TAvailablePaymentMethod,
  features: TPaymentFeaturesState,
  handleFormChange: (state: FormState) => void,
  onSuccess: (paymentMethodId: number) => void,
  onError: (error: string) => void,
): UseAdyenSDKReturn => {
  const context = useContext(ShellContext);
  const { environment } = context;
  const userLocale = environment.getUserLocale();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);

  const adyenCheckoutRef = useRef<Core | null>(null);
  const paymentMethodIdRef = useRef<number | null>(null);
  const transactionIdRef = useRef<number | null>(null);

  const handleAdditionalAction = useCallback((action: AdditionalAction) => {
    if (adyenCheckoutRef && adyenCheckoutRef.current) {
      setTransactionId(action.transactionId);

      // Update refs with the latest values
      paymentMethodIdRef.current = action.paymentMethodId;
      transactionIdRef.current = action.transactionId;

      adyenCheckoutRef.current
        .createFromAction(action.action)
        .mount(`#${additionalContainerId}`);
    }
  }, []);

  const setAdditionalDetails = useCallback(
    async (
      details: Record<string, unknown>,
      currTransactionId: number,
      currPaymentMethodId: number,
    ) => {
      try {
        const detailsResponse = await addPaymentDetails(currPaymentMethodId, {
          transactionId: currTransactionId,
          details: convertToBase64(JSON.stringify(details)),
        });

        const adyenResponse = parseFormSessionId(detailsResponse.formSessionId);

        if (adyenResponse.action && currPaymentMethodId && transactionId) {
          handleAdditionalAction({
            action: adyenResponse.action,
            paymentMethodId: currPaymentMethodId,
            transactionId: currTransactionId,
          });
        } else if (adyenResponse.resultCode === ADYEN_RESULT_CODE.AUTHORIZED) {
          onSuccess(currPaymentMethodId);
        } else if (
          adyenResponse.resultCode === ADYEN_RESULT_CODE.ERROR ||
          adyenResponse.resultCode === ADYEN_RESULT_CODE.REFUSED
        ) {
          onError((adyenResponse.refusalReason as string) || 'Payment error');
        }
      } catch (err) {
        onError('Registering payment details failed');
      }
    },
    [onSuccess, onError, handleAdditionalAction],
  );

  const handleAdditionalDetails = useCallback(
    (
      currPaymentMethodId: number | null,
      currTransactionId: number | null,
      state: AdditionalDetailState,
    ) => {
      // Use refs to get the latest values if the passed parameters are null
      const finalPaymentMethodId =
        currPaymentMethodId ?? paymentMethodIdRef.current;
      const finalTransactionId = currTransactionId ?? transactionIdRef.current;

      if (!finalPaymentMethodId || !finalTransactionId) {
        throw new Error('Missing paymentMethodId or transactionId');
      }

      setAdditionalDetails(
        state.data.details,
        finalTransactionId,
        finalPaymentMethodId,
      );
    },
    [setAdditionalDetails],
  );

  // Create a stable function reference that always uses current values from refs
  const stableHandleAdditionalDetails = useCallback(
    (state: AdditionalDetailState) => {
      const currentPaymentMethodId = paymentMethodIdRef.current;
      const currentTransactionId = transactionIdRef.current;

      handleAdditionalDetails(
        currentPaymentMethodId,
        currentTransactionId,
        state,
      );
    },
    [handleAdditionalDetails],
  );

  const adyenConf = useMemo(
    () =>
      getAdyenConf(
        paymentMethod,
        userLocale,
        features,
        handleFormChange,
        stableHandleAdditionalDetails,
      ),
    [
      paymentMethod,
      userLocale,
      features,
      handleFormChange,
      stableHandleAdditionalDetails,
    ],
  );

  useEffect(() => {
    const initAdyen = async () => {
      adyenCheckoutRef.current = await AdyenCheckout(adyenConf);
      adyenCheckoutRef.current
        .create('card', {
          ...(paymentMethod.formSessionId
            ? parseFormSessionId(paymentMethod.formSessionId)
            : {}),
          showBrandsUnderCardNumber: true,
        })
        .mount(`#${containerId}`);

      setScriptLoaded(true);
    };

    if (showAdyen) {
      if (!adyenCheckoutRef.current) {
        initAdyen();
      }
    } else {
      adyenCheckoutRef.current = null;
    }
  }, [showAdyen, adyenConf]);

  return {
    scriptLoaded,
    handleAdditionalAction,
    setAdditionalDetails,
  };
};
