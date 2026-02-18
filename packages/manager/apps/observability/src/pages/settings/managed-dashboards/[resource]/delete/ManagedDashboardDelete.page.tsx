import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/muk';

import ErrorMessage from '@/components/error/ErrorMessage.component';
import { ConfirmationModal } from '@/components/listing/common/confirmation-modal/ConfirmationModal.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useDeleteGrafana } from '@/data/hooks/grafana/useDeleteGrafana.hook';
import { useGrafana } from '@/data/hooks/grafana/useGrafana.hook';
import { LocationPathParams, urls } from '@/routes/Routes.constants';

export default function ManagedDashboardDeletePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['managed-dashboards', NAMESPACES.ERROR]);
  const { addError, addSuccess } = useNotifications();
  const { mutateAsync: deleteGrafana, isPending, error } = useDeleteGrafana();

  const { selectedService } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';

  const { managedDashboardId } = useParams<LocationPathParams>();
  const currentManagedDashboardId = managedDashboardId ?? '';

  const { data: managedDashboard } = useGrafana(resourceName, currentManagedDashboardId);

  const handleDismiss = () => {
    navigate(urls.managedDashboards);
  };

  const callDeleteGrafanaAsync = async () => {
    try {
      await deleteGrafana({
        resourceName,
        grafanaId: currentManagedDashboardId,
      });

      addSuccess(t('managed-dashboards:delete.success'));

      handleDismiss();
    } catch (error) {
      addError(<ErrorMessage error={error as Error} />);
    }
  };

  const handleConfirm = (): void => {
    void callDeleteGrafanaAsync();
  };

  return (
    <ConfirmationModal
      title={t('managed-dashboards:delete.delete_managed_dashboard_title', {
        managedDashboard: managedDashboard?.currentState.title,
      })}
      message={t('managed-dashboards:delete.delete_managed_dashboard_description', {
        managedDashboard: managedDashboard?.currentState.title,
      })}
      onDismiss={handleDismiss}
      onConfirm={handleConfirm}
      confirmButtonLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      cancelButtonLabel={t('close', { ns: NAMESPACES.ACTIONS })}
      isConfirmButtonLoading={isPending}
      error={error as Error}
    />
  );
}
