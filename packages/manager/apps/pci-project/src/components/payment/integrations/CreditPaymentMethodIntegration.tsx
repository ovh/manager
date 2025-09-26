import {
  ODS_BUTTON_COLOR,
  ODS_CARD_COLOR,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCard,
  OdsFormField,
  OdsInput,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CREDIT_ORDER_CART,
  CREDITS_PREDEFINED_AMOUNT_SEQUENCE,
} from '@/payment/constants';
import {
  TPaymentCallbackReturnType,
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
} from '@/data/types/payment/payment-method.type';
import {
  ProjectPrice,
  TEligibility,
} from '@/data/types/payment/eligibility.type';
import { TCart } from '@/data/types/payment/cart.type';
import { useGetCreditAddonOption } from '@/data/hooks/payment/useCart';
import { addCartCreditOption } from '@/data/api/payment/cart';

type CreditPaymentMethodIntegrationProps = {
  paymentMethod: TPaymentMethod;
  handleValidityChange: (isValid: boolean) => void;
  eligibility: TEligibility;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  cartId: string;
  itemId: number;
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  onPaymentError: (err: string | undefined) => void;
};

const getAmountToPriceFormat = (
  value: string,
  { currencyCode, text }: ProjectPrice,
) => {
  return {
    currencyCode,
    text: text.replace(/\d+(?:[.,]\d+)?/, value),
    value: parseFloat(value),
  };
};

const CreditPaymentMethodIntegration: React.FC<CreditPaymentMethodIntegrationProps> = ({
  handleValidityChange,
  eligibility,
  paymentHandler,
  cartId,
  itemId,
  handleCustomSubmitButton,
}) => {
  const { t } = useTranslation([
    'payment/integrations/credit',
    'payment/integrations/credit/confirmation',
    'new/payment',
  ]);
  const minAmount = eligibility.minimumCredit;
  const predefinedAmounts: ProjectPrice[] = minAmount
    ? [
        minAmount,
        ...CREDITS_PREDEFINED_AMOUNT_SEQUENCE.map((multiple) => {
          const nextAmount = minAmount.value * multiple;
          return getAmountToPriceFormat(`${nextAmount}`, minAmount);
        }),
      ]
    : [];
  const [selectedAmount, setSelectedAmount] = useState<ProjectPrice | null>(
    null,
  );
  const [selectCustomAmount, setSelectCustomAmount] = useState<boolean>(false);
  const [customAmount, setCustomAmount] = useState<string | null>(null);
  const [
    creditCustomAmount,
    setCreditCustomAmount,
  ] = useState<ProjectPrice | null>(null);
  const [isConfirmationState, setIsConfirmationState] = useState<boolean>(
    false,
  );
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const confirmationResolveRef = useRef<(value: boolean) => void>(() => {});

  const { data: creditAddonOption } = useGetCreditAddonOption(cartId);

  const handleSelectedAmount = (amount: ProjectPrice) => {
    setSelectedAmount(amount);
    setSelectCustomAmount(false);
    setCustomAmount(null);
    setCreditCustomAmount(null);
  };

  const handleSelectCustomAmount = () => {
    setSelectedAmount(null);
    setSelectCustomAmount(true);
    setCustomAmount(null);
    setCreditCustomAmount(null);
  };

  const handleCustomAmountChanged = (value: string) => {
    setCustomAmount(value);
    if (eligibility.minimumCredit) {
      const amount = getAmountToPriceFormat(value, eligibility.minimumCredit);
      setCreditCustomAmount(amount);
    }
  };

  useEffect(() => {
    if (handleCustomSubmitButton) {
      handleCustomSubmitButton(
        t('pci_project_new_payment_btn_continue_credit', { ns: 'new/payment' }),
      );
    }
  }, []);

  useEffect(() => {
    handleValidityChange(
      !!selectedAmount ||
        (selectCustomAmount &&
          !!creditCustomAmount &&
          creditCustomAmount.value >= (eligibility.minimumCredit?.value ?? 0)),
    );
  }, [
    selectedAmount,
    selectCustomAmount,
    creditCustomAmount,
    handleValidityChange,
  ]);

  useImperativeHandle(
    paymentHandler,
    () => {
      return {
        submitPayment: async () => {
          return { continueProcessing: true };
        },
        onPaymentMethodRegistered: async () => {
          if (creditAddonOption && creditAddonOption.prices.length > 0) {
            const amount = selectCustomAmount
              ? creditCustomAmount
              : selectedAmount;

            await addCartCreditOption(cartId, {
              planCode: CREDIT_ORDER_CART.planCode,
              quantity: Math.floor(
                (amount?.value ?? 0) / creditAddonOption.prices[0].price.value,
              ),
              duration: creditAddonOption.prices[0].duration,
              pricingMode: creditAddonOption.prices[0].pricingMode,
              itemId,
            });
          }
          return { continueProcessing: true };
        },
        checkPaymentMethod: async () => {
          return { continueProcessing: true };
        },
        onCheckoutRetrieved: async (cart: TCart) => {
          if (cart.prices.withTax.value !== 0) {
            // We need to pay credits
            setIsConfirmationState(true);

            // We create a promise to wait for user validation
            const promise = new Promise<TPaymentCallbackReturnType>(
              (resolve) => {
                confirmationResolveRef.current = (r: boolean) => {
                  setIsFinalizing(true);
                  resolve({ continueProcessing: r });
                };
              },
            );

            return promise;
          }
          return { continueProcessing: true };
        },
        onCartFinalized: async (cart: TCart) => {
          setIsFinalizing(false);
          if (!cart.url || !window.top) {
            return { continueProcessing: true };
          }
          window.top.location.href = cart.url;
          return { continueProcessing: false };
        },
      };
    },
    [
      selectCustomAmount,
      creditCustomAmount,
      selectedAmount,
      creditAddonOption,
      itemId,
    ],
  );

  return (
    <div>
      <OdsText>
        {t('pci_project_new_payment_credit_explain', {
          ns: 'payment/integrations/credit',
        })}
      </OdsText>

      <div className="flex flex-wrap justify-content-between mt-6 gap-6">
        {predefinedAmounts.map((amount) => (
          <label
            htmlFor={`credit-amount-${amount.text}`}
            key={amount.text}
            className="cursor-pointer group"
          >
            <OdsCard
              color={ODS_CARD_COLOR.neutral}
              className={`flex items-center p-6 gap-6 
                          group-hover:bg-[var(--ods-color-primary-100)] 
                          group-hover:border-[var(--ods-color-primary-700)]
                          ${
                            selectedAmount?.text === amount.text
                              ? 'bg-[var(--ods-color-primary-050)] border-[var(--ods-color-primary-700)]'
                              : ''
                          }`}
            >
              <OdsRadio
                inputId={`credit-amount-${amount.text}`}
                name="credit-amount"
                onClick={() => handleSelectedAmount(amount)}
              />

              <OdsText>{amount.text}</OdsText>
            </OdsCard>
          </label>
        ))}
        <label
          htmlFor={`credit-amount-custom`}
          className="cursor-pointer group"
        >
          <OdsCard
            color={ODS_CARD_COLOR.neutral}
            className={`flex items-center p-6 gap-6 
                          group-hover:bg-[var(--ods-color-primary-100)] 
                          group-hover:border-[var(--ods-color-primary-700)]
                          ${
                            selectCustomAmount
                              ? 'bg-[var(--ods-color-primary-050)] border-[var(--ods-color-primary-700)]'
                              : ''
                          }`}
          >
            <OdsRadio
              inputId={`credit-amount-custom`}
              name="credit-amount"
              onClick={() => handleSelectCustomAmount()}
            />

            <OdsText>
              {t('pci_project_new_payment_credit_amount_other', {
                ns: 'payment/integrations/credit',
              })}
            </OdsText>
          </OdsCard>
        </label>
      </div>

      {selectCustomAmount && (
        <OdsFormField className="w-full">
          <label htmlFor="otherAmount">
            {t('pci_project_new_payment_credit_amount_other_label', {
              ns: 'payment/integrations/credit',
            })}
          </label>
          <OdsInput
            id="otherAmount"
            type={ODS_INPUT_TYPE.number}
            isRequired={true}
            min={eligibility.minimumCredit?.value ?? 0}
            value={customAmount}
            step={1}
            onOdsChange={(e) =>
              e.target.value && handleCustomAmountChanged(`${e.target.value}`)
            }
            name={'custom-amount'}
            hasError={!creditCustomAmount}
          />
        </OdsFormField>
      )}

      <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-6">
        {t('pci_project_new_payment_credit_info', {
          ns: 'payment/integrations/credit',
        })}
      </OdsText>

      {isConfirmationState && (
        <OdsCard color={ODS_CARD_COLOR.primary} className={'mt-6 p-6'}>
          <OdsText preset={ODS_TEXT_PRESET.heading3}>
            {t('pci_project_new_payment_credit_confirmation_title', {
              ns: 'payment/integrations/credit/confirmation',
            })}
          </OdsText>

          <OdsText className="mt-6 text-bold">
            {t('pci_project_new_payment_credit_thanks', {
              ns: 'payment/integrations/credit/confirmation',
            })}
          </OdsText>

          <OdsText className="mt-6">
            {t('pci_project_new_payment_credit_explain', {
              ns: 'payment/integrations/credit/confirmation',
              amount: (selectCustomAmount ? creditCustomAmount : selectedAmount)
                ?.text,
            })}
          </OdsText>

          <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-6">
            {t('pci_project_new_payment_credit_info', {
              ns: 'payment/integrations/credit/confirmation',
            })}
          </OdsText>

          <OdsButton
            color={ODS_BUTTON_COLOR.primary}
            className="mt-6"
            label={t('pci_project_new_payment_credit_credit_and_pay', {
              ns: 'payment/integrations/credit/confirmation',
            })}
            onClick={() => confirmationResolveRef.current(true)}
            isLoading={isFinalizing}
          ></OdsButton>
        </OdsCard>
      )}
    </div>
  );
};

export default CreditPaymentMethodIntegration;
