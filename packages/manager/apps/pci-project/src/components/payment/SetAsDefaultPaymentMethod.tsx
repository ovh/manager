import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsCheckbox, OdsMessage } from '@ovhcloud/ods-components/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import { TAvailablePaymentMethod } from '@/data/types/payment/payment-method.type';

export type SetAsDefaultPaymentMethodProps = {
  selectedPaymentMethod?: TAvailablePaymentMethod | null;
  eligibility: TEligibility;
  availablePaymentMethods: TAvailablePaymentMethod[];
  isSetAsDefault: boolean;
  handleSetAsDefaultChange?: (value: boolean) => void;
};

const SetAsDefaultPaymentMethod: React.FC<SetAsDefaultPaymentMethodProps> = ({
  selectedPaymentMethod,
  eligibility,
  availablePaymentMethods,
  isSetAsDefault,
  handleSetAsDefaultChange = () => {},
}) => {
  const { t } = useTranslation(['payment/register/method']);
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment?.getUser();
  const forceSetAsDefaultChoice = eligibility.actionsRequired.includes(
    'addPaymentMethod',
  );
  const isPaymentMethodRegisterable = !!selectedPaymentMethod?.registerable;
  const isInUSRegion = ovhSubsidiary === 'US';

  if (
    !isPaymentMethodRegisterable ||
    !forceSetAsDefaultChoice ||
    availablePaymentMethods.length === 0
  ) {
    return null;
  }

  const message = isInUSRegion ? (
    isSetAsDefault && (
      <OdsMessage
        class="mb-3 text-justify"
        color={ODS_MESSAGE_COLOR.information}
        isDismissible={false}
      >
        {t(
          'ovh_payment_method_register_set_as_default_choice_information_no_default_payment_method_ovh_sas',
          {
            ns: 'payment/register/method',
          },
        )}
        {t('ovh_payment_method_register_set_as_default_choice_information_US', {
          ns: 'payment/register/method',
        })}
      </OdsMessage>
    )
  ) : (
    <OdsMessage
      class="mb-3 text-justify"
      color={ODS_MESSAGE_COLOR.information}
      isDismissible={false}
    >
      {t(
        'ovh_payment_method_register_set_as_default_choice_information_no_default_payment_method_ovh_sas',
        {
          ns: 'payment/register/method',
        },
      )}
      {t('ovh_payment_method_register_set_as_default_choice_information', {
        ns: 'payment/register/method',
      })}
    </OdsMessage>
  );

  return (
    <div className="my-6">
      {/* {isInUSRegion ? (
        <div>
          {selectedPaymentMethod.paymentType === TPaymentMethodType.PAYPAL ? (
            <OdsText>
              {t('ovh_payment_method_register_force_as_default_paypal_US')}
            </OdsText>
          ) : (
            <OdsText>
              {t('ovh_payment_method_register_force_as_default')}
            </OdsText>
          )}
        </div>
      ) : (
        <OdsText>{t('ovh_payment_method_register_force_as_default')}</OdsText>
      )} */}
      <label htmlFor="set-as-default" className="mb-6 flex items-center">
        <OdsCheckbox
          inputId="set-as-default"
          name="setAsDefault"
          className="mr-3"
          isRequired={true}
          onOdsChange={(e) => handleSetAsDefaultChange(e.target.isChecked)}
          isChecked={isSetAsDefault}
        />
        {t('ovh_payment_method_register_set_as_default_choice', {
          ns: 'payment/register/method',
        })}
      </label>

      {message}
    </div>
  );
};

export default SetAsDefaultPaymentMethod;
