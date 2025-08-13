import React, { useEffect, useImperativeHandle, useMemo } from 'react';
import {
  OdsCard,
  OdsInput,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_CARD_COLOR,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import isIBAN from 'validator/lib/isIBAN';
import { TChallengeStatus } from '@/data/types/payment/payment-challenge.type';
import { usePaymentChallenge } from '@/data/hooks/payment/usePaymentChallenge';
import {
  TEligibilityRequiredAction,
  TEligibility,
} from '@/data/types/payment/eligibility.type';
import {
  TPaymentMethodType,
  TUserPaymentMethod,
} from '@/data/types/payment/payment-method.type';
import { CHALLENGE_CREDIT_CARD_LENGTH } from '@/payment/constants';

const PAYMENT_TYPES_TO_SUBMIT_IN_CHALLENGE = [
  TPaymentMethodType.CREDIT_CARD,
  TPaymentMethodType.BANK_ACCOUNT,
];

export type TPaymentMethodChallengeProps = {
  challengeHandler: React.Ref<TPaymentMethodChallengeRef>;
  eligibility: TEligibility;
  paymentMethod?: TUserPaymentMethod;
  handleValidityChange: (isValid: boolean) => void;
};

export type TPaymentMethodChallengeRef = {
  submitChallenge: () => Promise<TChallengeStatus>;
};

const isChallengePaymentMethodRequired = (
  eligibility: TEligibility,
): boolean => {
  return eligibility.actionsRequired.includes(
    TEligibilityRequiredAction.CHALLENGE_PAYMENT_METHOD,
  );
};

const PaymentMethodChallenge: React.FC<TPaymentMethodChallengeProps> = ({
  challengeHandler,
  eligibility,
  paymentMethod,
  handleValidityChange,
}) => {
  const { t } = useTranslation('payment/challenge');
  const [value, setValue] = React.useState<string>('');
  const [mustRetry, setMustRetry] = React.useState<boolean>(false);

  const isChallengeRequired = useMemo(
    () => isChallengePaymentMethodRequired(eligibility),
    [eligibility],
  );

  const { mutate } = usePaymentChallenge();

  const isValidValue = () => {
    switch (paymentMethod?.paymentType) {
      case TPaymentMethodType.CREDIT_CARD:
        return (
          value.length === CHALLENGE_CREDIT_CARD_LENGTH &&
          /^[0-9]+$/.test(value)
        );
      case TPaymentMethodType.BANK_ACCOUNT:
        return value.length > 0 && isIBAN(value);
      default:
        return true;
    }
  };

  const canSubmit = () =>
    !isChallengeRequired ||
    (!!paymentMethod?.paymentMethodId && isValidValue());

  useEffect(() => {
    const isValid = canSubmit();
    handleValidityChange(isValid);
  }, [value, isChallengeRequired, paymentMethod]);

  const submitChallenge = (
    currIsChallengeRequired: boolean,
    currValue: string,
    currPaymentMethod?: TUserPaymentMethod,
  ) => async (): Promise<TChallengeStatus> => {
    setMustRetry(false);

    if (currIsChallengeRequired) {
      return new Promise((resolve) => {
        if (!currPaymentMethod) {
          setMustRetry(true);
          resolve('retry');
          return;
        }

        if (
          !PAYMENT_TYPES_TO_SUBMIT_IN_CHALLENGE.includes(
            currPaymentMethod.paymentType,
          )
        ) {
          setMustRetry(false);
          resolve('success');
          return;
        }

        mutate(
          {
            paymentMethodId: `${currPaymentMethod.paymentMethodId}`,
            challenge: currValue,
          },
          {
            onSuccess: (status: TChallengeStatus) => {
              setMustRetry(status === 'retry');
              resolve(status);
            },
            onError: () => {
              setMustRetry(true);
              resolve('retry');
            },
          },
        );
      });
    }
    return Promise.resolve('success');
  };

  useImperativeHandle(
    challengeHandler,
    () => {
      return {
        submitChallenge: submitChallenge(
          isChallengeRequired,
          value,
          paymentMethod,
        ),
      };
    },
    [isChallengeRequired, value, paymentMethod],
  );

  const creditCardChallenge =
    paymentMethod?.paymentType === TPaymentMethodType.CREDIT_CARD ? (
      <OdsCard
        color={ODS_CARD_COLOR.neutral}
        className="bg-[var(--ods-color-critical-050)] p-6 mb-6 w-full flex gap-6 justify-between items-center"
      >
        <OdsText className="basis-1/2">
          <div
            dangerouslySetInnerHTML={{
              __html: t('pci_project_new_payment_challenge_credit_card'),
            }}
          />
        </OdsText>
        <div className="basis-1/2">
          <div className="challenge-credit-card">
            <input
              name={'challenge-input'}
              type="text"
              className="placeholder:text-[11px] absolute w-[70px] h-[30px]
                          rounded-[2px] border-[0.9px]
                          border-[var(--ods-color-information-100)]
                          box-border bg-[var(--ods-color-information-000)]
                          p-[4px] pr-[2px] text-[14px] font-semibold
                          leading-[1.29] tracking-[1.86px]
                          text-[var(--ods-color-text)] top-[68px] left-[10px]"
              placeholder="XXXX XX"
              maxLength={CHALLENGE_CREDIT_CARD_LENGTH}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label={t('pci_project_new_payment_challenge_credit_card')}
              aria-invalid={!isValidValue()}
              aria-required="true"
              aria-describedby={mustRetry ? 'challenge-error' : undefined}
            />
          </div>
        </div>
      </OdsCard>
    ) : null;

  const paypalChallenge =
    paymentMethod?.paymentType === TPaymentMethodType.PAYPAL ? (
      <OdsCard
        color={ODS_CARD_COLOR.neutral}
        className="bg-[var(--ods-color-critical-050)] p-6 mb-6 w-full"
      >
        <OdsText>{t('pci_project_new_payment_challenge_paypal')}</OdsText>
      </OdsCard>
    ) : null;

  const bankAccountChallenge =
    paymentMethod?.paymentType === TPaymentMethodType.BANK_ACCOUNT ? (
      <OdsCard
        color={ODS_CARD_COLOR.neutral}
        className="bg-[var(--ods-color-critical-050)] p-6 mb-6 w-full"
      >
        <OdsText className="mb-4">
          {t('pci_project_new_payment_challenge_bank_account')}
        </OdsText>
        <div>
          <OdsInput
            className="w-96"
            name={'challenge-input'}
            type={ODS_INPUT_TYPE.text}
            value={value}
            onOdsChange={(e) => setValue(e.detail.value as string)}
            aria-label={t('pci_project_new_payment_challenge_bank_account')}
            aria-invalid={!isValidValue()}
            aria-required="true"
            aria-describedby={mustRetry ? 'challenge-error' : undefined}
          />
        </div>
      </OdsCard>
    ) : null;

  return isChallengeRequired ? (
    <div className="mt-6">
      {mustRetry && (
        <OdsMessage
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.critical}
          className="mb-6 w-full"
          role="alert"
          id="challenge-error"
        >
          <OdsText>
            {t('pci_project_new_payment_challenge_error_retry_challenge')}
          </OdsText>
        </OdsMessage>
      )}
      {creditCardChallenge}
      {paypalChallenge}
      {bankAccountChallenge}
    </div>
  ) : null;
};

export default PaymentMethodChallenge;
