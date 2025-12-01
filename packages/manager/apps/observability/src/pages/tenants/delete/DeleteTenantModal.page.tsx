import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/muk';

import { ConfirmationModal } from '@/components/listing/common/confirmation-modal/ConfirmationModal.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useDeleteTenant } from '@/data/hooks/tenants/useDeleteTenant.hook';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import { LocationPathParams, urls } from '@/routes/Routes.constants';

const DeleteTenantModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['tenants', NAMESPACES.ERROR]);
  const { addError, addSuccess } = useNotifications();
  const { mutateAsync: deleteTenant, isPending, error } = useDeleteTenant();

  const { selectedService } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';

  const { tenantId } = useParams<LocationPathParams>();
  const currentTenantId = tenantId ?? '';

  const { data: tenant } = useTenant(resourceName, currentTenantId);

  const handleDismiss = () => {
    navigate(urls.tenants);
  };

  const callDeleteTenantAsync = async () => {
    try {
      await deleteTenant({
        resourceName,
        tenantId: currentTenantId,
      });

      addSuccess(t('tenants:delete.success'));

      handleDismiss();
    } catch (error) {
      const { message } = error as ApiError;
      addError(t(`${NAMESPACES.ERROR}:error_message`, { message }));
    }
  };

  const handleConfirm = (): void => {
    void callDeleteTenantAsync();
  };

  return (
    <ConfirmationModal
      title={t('tenants:delete.delete_tenant_title')}
      message={t('tenants:delete.delete_tenant_description', {
        tenantName: tenant?.currentState.title,
      })}
      onDismiss={handleDismiss}
      onConfirm={handleConfirm}
      confirmButtonLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      cancelButtonLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      isConfirmButtonLoading={isPending}
      error={error?.message}
    />
  );
};

export default DeleteTenantModal;
