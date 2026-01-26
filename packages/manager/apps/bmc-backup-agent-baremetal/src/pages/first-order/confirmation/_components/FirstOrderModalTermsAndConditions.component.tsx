import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsButton, OdsCheckbox, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { CreateCartResult } from '@ovh-ux/manager-module-order';
import { LinkType, Links } from '@ovh-ux/manager-react-components';

import { useCheckoutBackupAgentCart } from '@/hooks/useCheckoutBackupAgentCart';

import {
  FIRST_ORDER_TC_CONFIRM_BUTTON_TEST_ID,
  FIRST_ORDER_TC_CONFIRM_CHECKBOX_TEST_ID,
} from '../FirstOrderConfirmationModal.constants';
import { FirstOrderModalCancelButton } from './FirstOrderModalCancelButton.component';

type FirstOrderModalTermsAndConditionsProps = {
  cart: CreateCartResult;
  onSuccess: () => void;
  onCancel: () => void;
};

export const FirstOrderModalTermsAndConditions = ({
  cart,
  onSuccess,
  onCancel,
}: FirstOrderModalTermsAndConditionsProps) => {
  const { t } = useTranslation(['onboarding', NAMESPACES.ERROR, NAMESPACES.ACTIONS]);

  const [isContractAccepted, setIsContractAccepted] = useState(false);

  const {
    mutate: requestOrder,
    isPending,
    error,
  } = useCheckoutBackupAgentCart({
    onSuccess,
  });

  return (
    <>
      <div className="flex flex-col gap-4 pb-6">
        <OdsText preset="heading-4">{t('first_order_terms_and_conditions_title')}</OdsText>
        <OdsText preset="paragraph">{t('first_order_terms_and_conditions_description')}</OdsText>
        <div className="flex flex-col gap-2">
          {cart.contractList.map(({ name, url }) => (
            <Links key={name} href={url} target="_blank" type={LinkType.external} label={name} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <OdsCheckbox
            data-testid={FIRST_ORDER_TC_CONFIRM_CHECKBOX_TEST_ID}
            name="confirm-contract"
            inputId="confirm-contract"
            isChecked={isContractAccepted}
            onOdsChange={(event) => setIsContractAccepted(event.detail.checked)}
          />
          <label className="cursor-pointer" htmlFor="confirm-contract">
            <OdsText preset="span">{t('first_order_terms_and_conditions_confirm_label')}</OdsText>
          </label>
        </div>
        {error && (
          <OdsMessage color="danger" isDismissible={false} className="w-full">
            {t(`${NAMESPACES.ERROR}:error_message`, {
              message: error.response?.data.message ?? error.message,
            })}
          </OdsMessage>
        )}
      </div>

      <FirstOrderModalCancelButton onClick={onCancel} />
      <OdsButton
        data-testid={FIRST_ORDER_TC_CONFIRM_BUTTON_TEST_ID}
        slot="actions"
        label={t('confirm', { ns: NAMESPACES.ACTIONS })}
        isDisabled={!isContractAccepted}
        onClick={() => requestOrder({ cartId: cart.cartId })}
        isLoading={isPending}
      />
    </>
  );
};
