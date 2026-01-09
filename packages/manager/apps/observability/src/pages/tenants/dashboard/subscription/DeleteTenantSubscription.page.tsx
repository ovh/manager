import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/muk';

import { ErrorMessage } from '@/components/error/ErrorMessage.component';
import { ConfirmationModal } from '@/components/listing/common/confirmation-modal/ConfirmationModal.component';
import { useDeleteSubscription } from '@/data/hooks/tenants/useDeleteSubscription.hook';
import { LocationPathParams } from '@/routes/Routes.constants';

export default function DeleteTenantSubscription() {
  const { t } = useTranslation(['tenants', NAMESPACES.ERROR]);
  const { addError, addSuccess } = useNotifications();
  const { tenantId = '', resourceName = '', subscriptionId = '' } = useParams<LocationPathParams>();
  const navigate = useNavigate();

  const handleDismiss = () => {
    navigate(-1);
  };

  const {
    mutate: deleteSubscription,
    isPending,
    error,
  } = useDeleteSubscription({
    onSuccess: () => {
      addSuccess(t('tenants:dashboard.subscription_listing.unsubscribe.success'));
      handleDismiss();
    },
    onError: (error) => {
      addError(<ErrorMessage error={error} />);
    },
  });

  const handleConfirm = () => {
    deleteSubscription({
      tenantId,
      resourceName,
      subscriptionId,
    });
  };
  return (
    <ConfirmationModal
      title={t('tenants:dashboard.subscription_listing.unsubscribe.title')}
      message={t('tenants:dashboard.subscription_listing.unsubscribe.warning')}
      onDismiss={handleDismiss}
      onConfirm={handleConfirm}
      confirmButtonLabel={t('tenants:dashboard.subscription_listing.unsubscribe.confirm')}
      cancelButtonLabel={t('tenants:dashboard.subscription_listing.unsubscribe.cancel')}
      isConfirmButtonLoading={isPending}
      error={error as Error}
    />
  );
}
