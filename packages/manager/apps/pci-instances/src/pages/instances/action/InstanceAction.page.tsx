import { FC, useCallback, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PciModal } from '@ovh-ux/manager-pci-common';
import {
  getInstanceNameById,
  updateDeletedInstanceStatus,
} from '@/data/hooks/instance/useInstances';
import queryClient from '@/queryClient';
import { useUrlLastSection } from '@/hooks/url/useUrlLastSection';
import { useUrlSearchParams } from '@/hooks/url/useUrlSearchParams';
import { ActionModalContent } from './modal/ActionModalContent.component';
import { useInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';

const InstanceAction: FC = () => {
  const { t } = useTranslation(['actions', 'common']);
  const navigate = useNavigate();
  const { projectId } = useParams() as {
    projectId: string;
  };
  const { addError, addSuccess } = useNotifications();
  const section = useUrlLastSection();
  const { instanceId } = useUrlSearchParams('instanceId');
  const instanceName = useMemo(
    () => getInstanceNameById(instanceId, queryClient),
    [instanceId],
  );

  const canExecuteAction = instanceId && instanceName && section;

  const executeSuccessCallback = useCallback((): void => {
    if (!instanceId) return;
    switch (section) {
      case 'delete':
        updateDeletedInstanceStatus(queryClient, instanceId);
        break;
      case 'start':
      case 'stop':
      default:
    }
  }, [instanceId, section]);

  const handleModalClose = () => {
    navigate('..');
  };

  const handleMutationSuccess = () => {
    executeSuccessCallback();
    addSuccess(
      t(`pci_instances_actions_${section}_instance_success_message`, {
        name: instanceName,
      }),
      true,
    );
    handleModalClose();
  };

  const handleMutationError = () => {
    addError(
      t(`pci_instances_actions_${section}_instance_error_message`, {
        name: instanceName,
      }),
      true,
    );
    handleModalClose();
  };

  const handleUnknownError = useCallback(() => {
    if (!canExecuteAction)
      addError(t('pci_instances_actions_instance_unknown_error_message'), true);
  }, [addError, canExecuteAction, t]);

  const { mutationHandler, isPending } = useInstanceAction(section, projectId, {
    onError: handleMutationError,
    onSuccess: handleMutationSuccess,
  });

  const handleInstanceAction = () => {
    mutationHandler(instanceId);
  };

  useEffect(() => {
    handleUnknownError();
  }, [handleUnknownError, instanceId, instanceName, section]);

  if (!canExecuteAction) return <Navigate to=".." />;

  return (
    <PciModal
      type={section === 'delete' ? 'warning' : 'default'}
      title={t(`pci_instances_actions_${section}_instance_title`)}
      isPending={isPending}
      isDisabled={isPending}
      onClose={handleModalClose}
      onConfirm={handleInstanceAction}
      onCancel={handleModalClose}
    >
      <ActionModalContent type={section} instanceName={instanceName} />
    </PciModal>
  );
};

export default InstanceAction;
