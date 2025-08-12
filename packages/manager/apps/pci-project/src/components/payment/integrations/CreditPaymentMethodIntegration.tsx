import { CurrencyCode } from '@ovh-ux/manager-react-components';
import {
  ODS_CARD_COLOR,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsCard,
  OdsFormField,
  OdsInput,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CREDITS_PREDEFINED_AMOUNT_SEQUENCE } from '@/payment/constants';
import { TPaymentMethod } from '@/data/types/payment/payment-method.type';
import {
  ProjectPrice,
  TEligibility,
} from '@/data/types/payment/eligibility.type';

type CreditPaymentMethodIntegrationProps = {
  paymentMethod: TPaymentMethod;
  handleValidityChange: (isValid: boolean) => void;
  eligibility: TEligibility;
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
}) => {
  const { t } = useTranslation('payment/integrations/credit');
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

  return (
    <div>
      <OdsText>{t('pci_project_new_payment_credit_explain')}</OdsText>

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
              {t('pci_project_new_payment_credit_amount_other')}
            </OdsText>
          </OdsCard>
        </label>
      </div>

      {selectCustomAmount && (
        <OdsFormField className="w-full">
          <label htmlFor="otherAmount">
            {t('pci_project_new_payment_credit_amount_other_label')}
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
        {t('pci_project_new_payment_credit_info')}
      </OdsText>
    </div>
  );
};

export default CreditPaymentMethodIntegration;
