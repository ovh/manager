import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { DeleteModal, useNotifications } from '@ovh-ux/muk';

import ErrorMessage from '@/components/error/ErrorMessage.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';

export default function ServiceDeletePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['services', 'shared']);
  const { addSuccess, addError } = useNotifications();
  const { selectedService } = useObservabilityServiceContext();
  const { terminateService, isPending } = useDeleteService({
    onSuccess: () => {
      addSuccess(t('delete.success', { serviceName: resourceName }));
      handleClose();
    },
    onError: (error) => {
      addError(<ErrorMessage error={error} />);
      handleClose();
    },
  });

  const resourceName = selectedService?.id ?? '';
  const handleClose = () => navigate(-1);
  const handleConfirmDelete = () => terminateService({ resourceName });

  return (
    <DeleteModal
      open
      serviceTypeName={selectedService?.currentState.displayName ?? resourceName}
      onConfirmDelete={handleConfirmDelete}
      onClose={handleClose}
      isLoading={isPending || !resourceName}
    />
  );
}
