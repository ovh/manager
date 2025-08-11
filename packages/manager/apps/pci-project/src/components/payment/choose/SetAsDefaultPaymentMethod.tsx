import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import {
  OdsCheckbox,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  TEligibility,
  TEligibilityRequiredAction,
} from '@/data/types/payment/eligibility.type';
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
    TEligibilityRequiredAction.ADD_PAYMENT_METHOD,
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
        className="mb-3 text-justify"
        color={ODS_MESSAGE_COLOR.information}
        isDismissible={false}
      >
        <OdsText>
          {t(
            'ovh_payment_method_register_set_as_default_choice_information_US',
            {
              ns: 'payment/register/method',
            },
          )}
        </OdsText>
      </OdsMessage>
    )
  ) : (
    <OdsMessage
      className="mb-3 text-justify"
      color={ODS_MESSAGE_COLOR.information}
      isDismissible={false}
    >
      <div>
        <OdsText>
          {t(
            'ovh_payment_method_register_set_as_default_choice_information_no_default_payment_method_ovh_sas',
            {
              ns: 'payment/register/method',
            },
          )}
        </OdsText>
        <OdsText>
          {t('ovh_payment_method_register_set_as_default_choice_information', {
            ns: 'payment/register/method',
          })}
        </OdsText>
      </div>
    </OdsMessage>
  );

  return (
    <div className="my-6">
      <label htmlFor="set-as-default" className="mb-6 flex items-center">
        <OdsCheckbox
          data-testid="ods-checkbox-set-as-default"
          inputId="set-as-default"
          name="setAsDefault"
          className="mr-3"
          isRequired={true}
          onOdsChange={(e) => handleSetAsDefaultChange(e.detail.checked)}
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
