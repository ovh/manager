import { useState } from 'react';

import { useCheckoutOrder } from '@key-management-service/data/hooks/useCheckoutOrder';
import { useTranslation } from 'react-i18next';

import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { Message } from '@ovhcloud/ods-react';
import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { CreateCartResult } from '@ovh-ux/manager-module-order';
import { Button } from '@ovh-ux/muk';

import { ExternalLink } from '@/common/components/link/Link.component';

import {
  ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID,
  ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID,
} from './OrderOkmsModal.page.constants';
import { OkmsOrderModalCancelButton } from './OrderOkmsModalCancelButton.component';

type OrderOkmsModalTermsAndConditionsProps = {
  cart: CreateCartResult;
  onSuccess: () => void;
  onCancel: () => void;
};

export const OrderOkmsModalTermsAndConditions = ({
  cart,
  onSuccess,
  onCancel,
}: OrderOkmsModalTermsAndConditionsProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ERROR, NAMESPACES.ACTIONS]);

  const [isContractAccepted, setIsContractAccepted] = useState(false);

  const {
    mutate: requestOrder,
    isPending,
    error,
  } = useCheckoutOrder({
    onSuccess,
  });

  return (
    <>
      <div className="flex flex-col gap-3 pb-6">
        <Text preset="heading-4">{t('create_okms_terms_and_conditions_title')}</Text>
        <Text preset="paragraph">{t('create_okms_terms_and_conditions_description')}</Text>
        <div className="flex flex-col gap-2">
          {cart.contractList.map(({ name, url }) => (
            <ExternalLink key={name} href={url}>
              {name}
            </ExternalLink>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <OdsCheckbox
            data-testid={ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID}
            name="confirm-contract"
            inputId="confirm-contract"
            isChecked={isContractAccepted}
            onOdsChange={(event) => setIsContractAccepted(event.detail.checked)}
          />
          <label className="cursor-pointer" htmlFor="confirm-contract">
            <Text preset="span">{t('create_okms_terms_and_conditions_confirm_label')}</Text>
          </label>
        </div>
        {error && (
          <Message color="critical" dismissible={false} className="w-full">
            {t(`${NAMESPACES.ERROR}:error_message`, {
              message: error.response.data.message,
            })}
          </Message>
        )}
      </div>

      <OkmsOrderModalCancelButton onClick={onCancel} />
      <Button
        data-testid={ORDER_OKMS_TC_CONFIRM_BUTTON_TEST_ID}
        slot="actions"
        disabled={!isContractAccepted}
        onClick={() => requestOrder({ cartId: cart.cartId })}
        loading={isPending}
      >
        {t('confirm', { ns: NAMESPACES.ACTIONS })}
      </Button>
    </>
  );
};
