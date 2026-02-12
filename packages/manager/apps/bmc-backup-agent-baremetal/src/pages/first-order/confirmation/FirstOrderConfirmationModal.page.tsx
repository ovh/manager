import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsMessage, OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';

import { baremetalsQueries } from '@ovh-ux/backup-agent/data/queries/baremetals.queries';
import { useRequiredParams } from '@ovh-ux/backup-agent/hooks/useRequiredParams';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useCreateBackupAgentCart } from '@/hooks/useCreateBackupAgentCart';
import { urls } from '@/routes/Routes.constants';

import {
  FIRST_ORDER_CREATE_CART_SPINNER_TEST_ID,
  FIRST_ORDER_CREATE_RETRY_BUTTON_TEST_ID,
} from './FirstOrderConfirmationModal.constants';
import { FirstOrderModalCancelButton } from './_components/FirstOrderModalCancelButton.component';
import { FirstOrderModalTermsAndConditions } from './_components/FirstOrderModalTermsAndConditions.component';

const FirstOrderConfirmationModal = () => {
  const { t } = useTranslation(['onboarding', NAMESPACES.ERROR, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  const { baremetalName } = useRequiredParams('baremetalName');

  // Disable refetch to avoid creating multiple carts
  const { data: baremetal, isPending: isBaremetalPending } = useQuery(
    baremetalsQueries.detail(baremetalName),
  );

  const {
    mutate: createCart,
    data: cart,
    isPending: isCartPending,
    error: cartError,
  } = useCreateBackupAgentCart();

  // Create cart once when baremetal data is available
  useEffect(() => {
    if (baremetal && !cart && !isCartPending && !cartError) {
      createCart({
        agentIp: baremetal.ip,
        agentRegionName: baremetal.region,
        agentServiceName: baremetal.name,
      });
    }
  }, [baremetal, cart, isCartPending, cartError, createCart]);

  const onSuccess = () => {
    navigate(`${urls.onboarding}?orderSuccess=true`);
  };

  const cancel = () => {
    navigate('..');
  };

  const handleRetry = () => {
    if (baremetal) {
      createCart({
        agentIp: baremetal.ip,
        agentRegionName: baremetal.region,
        agentServiceName: baremetal.name,
      });
    }
  };

  const isPending = isBaremetalPending || isCartPending;

  return (
    <OdsModal isOpen onOdsClose={cancel}>
      {isPending && (
        <div className="flex items-center justify-center py-3">
          <OdsSpinner data-testid={FIRST_ORDER_CREATE_CART_SPINNER_TEST_ID} />
        </div>
      )}

      {cartError && (
        <>
          <OdsMessage color="danger" isDismissible={false} className="w-full pb-5">
            {t(`${NAMESPACES.ERROR}:error_message`, {
              message: cartError.message,
            })}
          </OdsMessage>
          <FirstOrderModalCancelButton onClick={cancel} />
          <OdsButton
            data-testid={FIRST_ORDER_CREATE_RETRY_BUTTON_TEST_ID}
            slot="actions"
            label={t('retry', { ns: NAMESPACES.ACTIONS })}
            onClick={handleRetry}
            isLoading={isCartPending}
          />
        </>
      )}

      {cart && (
        <FirstOrderModalTermsAndConditions cart={cart} onCancel={cancel} onSuccess={onSuccess} />
      )}
    </OdsModal>
  );
};

export default FirstOrderConfirmationModal;
