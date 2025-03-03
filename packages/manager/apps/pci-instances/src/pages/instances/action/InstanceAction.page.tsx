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
import { ActionModalContent } from './modal/ActionModalContent.component';
import { useInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';
import NotFound from '@/pages/404/NotFound.page';
import { kebabToSnakeCase } from '@/utils';

export type TSectionType =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot';

const actionSectionRegex = /^(delete|start|stop|shelve|unshelve|soft-reboot|hard-reboot)$/;

const InstanceAction: FC = () => {
  const { t } = useTranslation(['actions', 'common']);
  const navigate = useNavigate();
  const { projectId, instanceId } = useParams() as {
    projectId: string;
    instanceId?: string;
  };
  const { addError, addSuccess } = useNotifications();
  const section = useUrlLastSection<TSectionType>(
    actionSectionRegex.test.bind(actionSectionRegex),
  );

  const snakeCaseSection = useMemo(
    () => (section ? kebabToSnakeCase(section) : ''),
    [section],
  );

  const instanceName = useMemo(
    () => getInstanceNameById(projectId, instanceId, queryClient),
    [instanceId, projectId],
  );

  const canExecuteAction = !!instanceId && !!instanceName && !!section;

  const executeSuccessCallback = useCallback((): void => {
    if (!instanceId) return;
    if (section === 'delete') {
      updateDeletedInstanceStatus(projectId, queryClient, instanceId);
    }
  }, [instanceId, projectId, section]);

  const handleModalClose = () => {
    navigate('..');
  };

  const handleMutationSuccess = () => {
    executeSuccessCallback();
    addSuccess(
      t(`pci_instances_actions_${snakeCaseSection}_instance_success_message`, {
        name: instanceName,
      }),
      true,
    );
    handleModalClose();
  };

  const handleMutationError = () => {
    addError(
      t(`pci_instances_actions_${snakeCaseSection}_instance_error_message`, {
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

  if (!instanceId || !section) return <NotFound />;
  if (!instanceName) return <Navigate to={'..'} />;

  return (
    <PciModal
      type={section === 'delete' ? 'warning' : 'default'}
      title={t(`pci_instances_actions_${snakeCaseSection}_instance_title`)}
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
