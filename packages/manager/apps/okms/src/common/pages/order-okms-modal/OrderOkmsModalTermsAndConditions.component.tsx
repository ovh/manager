import { useState } from 'react';

import { useCheckoutOrder } from '@key-management-service/data/hooks/useCheckoutOrder';
import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxControl,
  CheckboxLabel,
  Message,
} from '@ovhcloud/ods-react';
import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { CreateCartResult } from '@ovh-ux/manager-module-order';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { ExternalLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

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
  const { trackClick } = useOkmsTracking();

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
        <Text preset="paragraph">{t('create_okms_terms_and_conditions_description')}</Text>
        <div className="flex flex-col gap-2">
          {cart.contractList.map(({ name, url }) => (
            <ExternalLink key={name} href={url}>
              {name}
            </ExternalLink>
          ))}
        </div>

        <div className="flex">
          <Checkbox
            checked={isContractAccepted}
            onCheckedChange={(detail: CheckboxCheckedChangeDetail) =>
              setIsContractAccepted(detail.checked === true)
            }
          >
            <CheckboxControl
              data-testid={ORDER_OKMS_TC_CONFIRM_CHECKBOX_TEST_ID}
              className="shrink-0"
            />
            <CheckboxLabel>
              <Text preset="span">{t('create_okms_terms_and_conditions_confirm_label')}</Text>
            </CheckboxLabel>
          </Checkbox>
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
        onClick={() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['order', 'okms', 'confirm'],
          });
          requestOrder({ cartId: cart.cartId });
        }}
        loading={isPending}
      >
        {t('confirm', { ns: NAMESPACES.ACTIONS })}
      </Button>
    </>
  );
};
