import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ConfirmationModal } from '@/components/listing/common/confirmation-modal/ConfirmationModal.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useDeleteTenant } from '@/data/hooks/tenants/useDeleteTenant.hook';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import { LocationPathParams, urls } from '@/routes/Routes.constants';

const DeleteTenantModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['tenants', NAMESPACES.ERROR]);

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
      const deletedTenant = await deleteTenant({
        resourceName,
        tenantId: currentTenantId,
      });

      console.info('Deleted tenant:', deletedTenant);

      handleDismiss();
    } catch (error) {
      console.error('Failed to delete tenant', error);
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
