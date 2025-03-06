import { useNotifications } from '@ovh-ux/manager-react-components';
import { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  getInstanceById,
  updateDeletedInstanceStatus,
} from '@/data/hooks/instance/useInstances';
import { usePathMatch } from '@/hooks/url/usePathMatch';
import NotFound from '@/pages/404/NotFound.page';
import queryClient from '@/queryClient';
import { replaceToSnakeCase } from '@/utils';

import BaseInstanceActionPage from './BaseAction.page';
import { RescueActionPage } from './RescueAction.page';

export type TSectionType =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot'
  | 'reinstall'
  | 'rescue/start';

const actionSectionRegex = /(?:rescue\/(start|end)|(?<!rescue\/)(start|stop|shelve|unshelve|delete|soft-reboot|hard-reboot|reinstall))$/;

const InstanceAction: FC = () => {
  const { t } = useTranslation(['actions', 'common']);
  const navigate = useNavigate();
  const { projectId, instanceId } = useParams() as {
    projectId: string;
    instanceId?: string;
  };
  const { addError, addSuccess } = useNotifications();
  const section = usePathMatch<TSectionType>(actionSectionRegex);

  const snakeCaseSection = useMemo(
    () => (section ? replaceToSnakeCase(section) : ''),
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

  const handleModalClose = () => navigate('..');

  const handleMutationSuccess = () => {
    executeSuccessCallback();
    addSuccess(
      t(`pci_instances_actions_${snakeCaseSection}_instance_success_message`, {
        name: instanceName,
      }),
      true,
    );
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

  useEffect(() => {
    handleUnknownError();
  }, [handleUnknownError, instanceId, instanceName, section]);

  if (!instanceId || !section) return <NotFound />;
  if (!instanceName) return <Navigate to={'..'} />;

  const title = t(`pci_instances_actions_${snakeCaseSection}_instance_title`);

  const modalProps = {
    title,
    projectId,
    handleMutationError,
    handleMutationSuccess,
    handleModalClose,
    instance,
  };

  return section === 'rescue/start' ? (
    <RescueActionPage {...modalProps} section={section} />
  ) : (
    <BaseInstanceActionPage {...modalProps} section={section} />
  );
};

export default InstanceAction;
