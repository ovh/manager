import { FC, useCallback, useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  getInstanceById,
  updateDeletedInstanceStatus,
} from '@/data/hooks/instance/useInstances';
import queryClient from '@/queryClient';
import { useUrlLastSection } from '@/hooks/url/useUrlLastSection';
import { useInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';
import NotFound from '@/pages/404/NotFound.page';
import { kebabToSnakeCase } from '@/utils';
import ActionModal from '@/components/actionModal/ActionModal.component';

export type TSectionType =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot'
  | 'reinstall';

const actionSectionRegex = /^(delete|start|stop|shelve|unshelve|soft-reboot|hard-reboot|reinstall)$/;

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

  const instance = useMemo(
    () => getInstanceById(projectId, instanceId, queryClient),
    [instanceId, projectId],
  );

  const instanceName = instance?.name;

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
    mutationHandler(instance);
  };

  useEffect(() => {
    handleUnknownError();
  }, [handleUnknownError, instanceId, instanceName, section]);

  if (!instanceId || !section) return <NotFound />;
  if (!instanceName) return <Navigate to={'..'} />;

  return (
    <ActionModal
      title={t(`pci_instances_actions_${snakeCaseSection}_instance_title`)}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
      instanceName={instance.name}
      section={section}
      variant={section === 'delete' ? 'warning' : 'primary'}
    />
  );
};

export default InstanceAction;
