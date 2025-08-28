import React, { useEffect } from 'react';
import {
  OdsCard,
  OdsSpinner,
  OdsText,
  OdsRadio,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_CARD_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import usePaymentFeatureAvailabilities from '@/data/hooks/payment/usePaymentFeatureAvailabilities';
import { useFilteredAvailablePaymentMethods } from '@/data/hooks/payment/useFilteredAvailablePaymentMethods';
import PaymentIcon from './PaymentIcon';
import {
  TAvailablePaymentMethod,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import SetAsDefaultPaymentMethod from './SetAsDefaultPaymentMethod';
import ExplanationTexts from './ExplanationTexts';
import SepaInformationModal from './SepaInformationModal';

export type RegisterPaymentMethodProps = {
  eligibility: TEligibility;
  handlePaymentMethodChange?: (method: TAvailablePaymentMethod) => void;
  handleSetAsDefaultChange?: (value: boolean) => void;
  preselectedPaymentType?: string | null;
};

const RegisterPaymentMethod: React.FC<RegisterPaymentMethodProps> = ({
  eligibility,
  handlePaymentMethodChange = () => {},
  handleSetAsDefaultChange = () => {},
  preselectedPaymentType,
}) => {
  const { t } = useTranslation([
    'payment/add',
    'payment/register',
    'payment/register/payment-types',
    'payment/register/method',
    'payment/register/explanations',
    'payment/register/sepa-modal',
  ]);
  const {
    features,
    isLoading: isFFLoading,
  } = usePaymentFeatureAvailabilities();
  const {
    data: availablePaymentMethodsData,
    isLoading,
  } = useFilteredAvailablePaymentMethods(eligibility, features);
  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = React.useState<TAvailablePaymentMethod | null>(null);
  const [isSetAsDefault, setIsSetAsDefault] = React.useState<boolean>(false);
  const [isSepaModalAlreadyShown, setIsSepaModalAlreadyShown] = React.useState<
    boolean
  >(false);

  const availablePaymentMethods = availablePaymentMethodsData?.data;

  const onHandlePaymentMethodChange = (method: TAvailablePaymentMethod) => {
    setSelectedPaymentMethod(method);
    handlePaymentMethodChange(method);
  };

  const onHandleSetAsDefaultChange = (value: boolean) => {
    setIsSetAsDefault(value);
    handleSetAsDefaultChange(value);
  };

  useEffect(() => {
    if (
      preselectedPaymentType &&
      availablePaymentMethods &&
      !selectedPaymentMethod
    ) {
      const method = availablePaymentMethods.find(
        (m) => m.paymentType === preselectedPaymentType,
      );
      if (method) {
        onHandlePaymentMethodChange(method);
      }
    }
  }, [
    preselectedPaymentType,
    selectedPaymentMethod,
    availablePaymentMethods,
    onHandlePaymentMethodChange,
  ]);

  if (isLoading || isFFLoading || !availablePaymentMethods || !features) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <div>
      <OdsText className="mb-6" preset={ODS_TEXT_PRESET.heading2}>
        {t('pci_project_new_payment_register_title', {
          ns: 'payment/register',
        })}
      </OdsText>
      <div className="mb-3">
        <OdsText>
          {t('pci_project_new_payment_method_save_explain_part_1', {
            ns: 'payment/add',
          })}
        </OdsText>
        <OdsText>
          <strong>
            {t('pci_project_new_payment_method_save_explain_part_2', {
              ns: 'payment/add',
            })}
          </strong>
        </OdsText>
      </div>

      <div className="grid grid-cols-2 gap-6 my-6">
        {availablePaymentMethods.map((method) => (
          <label
            htmlFor={`payment-method-${method.paymentType}`}
            key={method.paymentType}
            className="cursor-pointer group"
          >
            <OdsCard
              color={ODS_CARD_COLOR.neutral}
              className={`flex items-center p-6 gap-6 
                          group-hover:bg-[var(--ods-color-primary-100)] 
                          group-hover:border-[var(--ods-color-primary-700)]
                          ${
                            selectedPaymentMethod?.paymentType ===
                            method.paymentType
                              ? 'bg-[var(--ods-color-primary-050)] border-[var(--ods-color-primary-700)]'
                              : ''
                          }`}
            >
              <OdsRadio
                inputId={`payment-method-${method.paymentType}`}
                name="payment-method"
                onClick={() => onHandlePaymentMethodChange(method)}
                isChecked={
                  selectedPaymentMethod?.paymentType === method.paymentType
                }
              />

              <PaymentIcon icon={method.icon} />

              <span className="font-bold">
                {method.readableName &&
                  t(method.readableName.key, { ns: method.readableName.ns })}
              </span>
            </OdsCard>
          </label>
        ))}
      </div>

      {availablePaymentMethods.length === 0 && (
        <OdsMessage
          className="mb-3"
          color={ODS_MESSAGE_COLOR.critical}
          isDismissible={false}
        >
          {t('ovh_payment_method_register_antifraud_error_message', {
            ns: 'payment/register/method',
          })}
        </OdsMessage>
      )}

      <ExplanationTexts
        features={features}
        selectedPaymentMethod={selectedPaymentMethod}
      />

      <SetAsDefaultPaymentMethod
        eligibility={eligibility}
        selectedPaymentMethod={selectedPaymentMethod}
        availablePaymentMethods={availablePaymentMethods}
        isSetAsDefault={isSetAsDefault}
        handleSetAsDefaultChange={onHandleSetAsDefaultChange}
      />

      {selectedPaymentMethod?.paymentType ===
        TPaymentMethodType.SEPA_DIRECT_DEBIT && (
        <SepaInformationModal
          features={features}
          isAlreadyShown={isSepaModalAlreadyShown || !!preselectedPaymentType}
          handleSepaModalShown={() => setIsSepaModalAlreadyShown(true)}
        />
      )}
    </div>
  );
};

export default RegisterPaymentMethod;
