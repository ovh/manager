import { useCallback } from 'react';
import { ANTI_FRAUD, AntiFraudError } from '@/constants';
import { getOrderFollowUp } from '@/data/api/order';
import { CartSummary } from '@/data/types/cart.type';
import {
  TOrderFollowUpLabel,
  TOrderFollowUpStatus,
  TOrderFollowUpStep,
} from '@/data/types/order.type';

export type MaybeApiError = {
  data:
    | {
        message: string | undefined;
      }
    | undefined;
};

const useAntiFraud = () => {
  const checkAntiFraud = useCallback((order: CartSummary): Promise<void> => {
    const performPolling = (
      currentTime: number,
      resolve: () => void,
      reject: (err: Error) => void,
    ) => {
      if (!order.orderId) {
        reject(new Error('orderId should not be null'));
        return;
      }

      try {
        getOrderFollowUp(order.orderId)
          .then((followUp) => {
            const validatingStep = followUp.find(
              (s) => s.step === TOrderFollowUpStep.VALIDATING,
            );

            if (validatingStep) {
              if (validatingStep.status === TOrderFollowUpStatus.DOING) {
                const isCustomerInfoCheckNeeded = !!validatingStep.history.find(
                  (h) =>
                    [
                      TOrderFollowUpLabel.FRAUD_DOCS_REQUESTED,
                      TOrderFollowUpLabel.FRAUD_MANUAL_REVIEW,
                    ].includes(h.label),
                );

                if (isCustomerInfoCheckNeeded) {
                  reject(new Error(AntiFraudError.NEED_CUSTOMER_INFO_CHECK));
                  return;
                }
              }

              // For any other status (DONE, ERROR, etc.) or DOING without fraud labels, resolve
              resolve();
            } else {
              setTimeout(
                () => performPolling(currentTime + 1000, resolve, reject),
                ANTI_FRAUD.POLLING_INTERVAL,
              );
            }
          })
          .catch((err) => {
            if (
              (err as MaybeApiError)?.data?.message?.includes(
                ANTI_FRAUD.CASE_FRAUD_REFUSED,
              )
            ) {
              reject(new Error(AntiFraudError.CASE_FRAUD_REFUSED));
            } else {
              reject(new Error(AntiFraudError.UNKNOWN));
            }
          });
      } catch (err) {
        if (
          (err as MaybeApiError)?.data?.message?.includes(
            ANTI_FRAUD.CASE_FRAUD_REFUSED,
          )
        ) {
          reject(new Error(AntiFraudError.CASE_FRAUD_REFUSED));
        } else {
          reject(new Error(AntiFraudError.UNKNOWN));
        }
      }
    };

    return new Promise((resolve, reject) => {
      performPolling(0, resolve, reject);
    });
  }, []);

  return { checkAntiFraud };
};

export default useAntiFraud;
