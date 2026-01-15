import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useCreateCart } from '@key-management-service/data/hooks/useCreateCart';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { OdsModal, OdsSpinner } from '@ovhcloud/ods-components/react';
import { Message } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

import { useProductType } from '@/common/hooks/useProductType';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { useShellContext } from '@/common/hooks/useShellContext';
import { registerPendingOrder } from '@/common/store/pendingOkmsOrder';

import {
  ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID,
  ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID,
} from './OrderOkmsModal.page.constants';
import { OkmsOrderModalCancelButton } from './OrderOkmsModalCancelButton.component';
import { OrderOkmsModalTermsAndConditions } from './OrderOkmsModalTermsAndConditions.component';

const OrderOkmsModal = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ERROR, NAMESPACES.ACTIONS]);
  const { environment } = useShellContext();
  const { region } = useRequiredParams('region');
  const productType = useProductType();
  const { ovhSubsidiary } = environment.getUser();
  const navigate = useNavigate();

  const onSuccess = () => {
    // Register the pending order
    registerPendingOrder(region);

    // Redirect to the appropriate page
    if (productType === 'key-management-service') {
      navigate(KMS_ROUTES_URLS.kmsListing);
    } else if (productType === 'secret-manager') {
      navigate('..');
    }
  };

  const cancel = () => {
    navigate('..');
  };

  const { mutate: createCart, data: cart, isPending, error } = useCreateCart(ovhSubsidiary, region);

  /* STEP 1 - create cart on mount */
  useEffect(createCart, [createCart]);

  return (
    <OdsModal isOpen onOdsClose={cancel}>
      {isPending && (
        <div className="flex items-center justify-center py-3">
          <OdsSpinner data-testid={ORDER_OKMS_CREATE_CART_SPINNER_TEST_ID} />
        </div>
      )}
      {/* ERROR - Retry button */}
      {error && (
        <>
          <Message color="critical" dismissible={false} className="w-full pb-5">
            {t(`${NAMESPACES.ERROR}:error_message`, {
              message: error.message,
            })}
          </Message>
          <OkmsOrderModalCancelButton onClick={cancel} />
          <Button
            data-testid={ORDER_OKMS_CREATE_RETRY_BUTTON_TEST_ID}
            slot="actions"
            onClick={() => createCart()}
            loading={isPending}
          >
            {t('retry', { ns: NAMESPACES.ACTIONS })}
          </Button>
        </>
      )}
      {/* STEP 2 - Terms and Conditions */}
      {cart && (
        <OrderOkmsModalTermsAndConditions cart={cart} onCancel={cancel} onSuccess={onSuccess} />
      )}
    </OdsModal>
  );
};

export default OrderOkmsModal;
