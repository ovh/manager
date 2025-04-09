import { useNotifications } from '@ovh-ux/manager-react-components';
import { FC, useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DefaultError } from '@tanstack/react-query';
import { updateInstanceFromCache } from '@/data/hooks/instance/useInstances';
import { usePathMatch } from '@/hooks/url/usePathMatch';
import NotFound from '@/pages/404/NotFound.page';
import queryClient from '@/queryClient';
import { isApiErrorResponse, replaceToSnakeCase } from '@/utils';
import BaseInstanceActionPage from './BaseAction.page';
import {
  TSectionType,
  useCachedInstanceAction,
} from '@/data/hooks/instance/action/useCachedInstanceAction';
import { useProjectId } from '@/hooks/project/useProjectId';
import BackupActionPage from './BackupActionPage';
import { RescueActionPage } from './RescueAction.page';
import BillingMonthlyActionPage from './BillingMonthlyActionPage';

const actionSectionRegex = /(?:rescue\/(start|end)|(?<!rescue\/)(start|stop|shelve|unshelve|delete|soft-reboot|hard-reboot|reinstall|backup|billing\/monthly\/activate))$/;

const InstanceAction: FC = () => {
  const { t } = useTranslation(['actions', 'common']);
  const navigate = useNavigate();
  const projectId = useProjectId();
  const { instanceId } = useParams();
  const { addError, addSuccess, addInfo } = useNotifications();
  const section = usePathMatch<TSectionType>(actionSectionRegex);

  const snakeCaseSection = useMemo(
    () => (section ? replaceToSnakeCase(section) : ''),
    [section],
  );

  const { instance, isLoading } = useCachedInstanceAction(instanceId, section);

  const executeSuccessCallback = useCallback((): void => {
    if (!instance) return;
    const newInstance = { ...instance, pendingTask: true };
    updateInstanceFromCache(queryClient, {
      projectId,
      instance: newInstance,
    });
  }, [instance, projectId]);

  const handleModalClose = () => navigate('..');

  const onSuccess = () => {
    executeSuccessCallback();

    const isRescue = section === 'rescue/start';

    if (isRescue) {
      addInfo(
        <Trans
          i18nKey={`pci_instances_actions_rescue_start_instance_info_message`}
          values={{
            name: instance?.name,
            ip: instance?.addresses[0].ip,
          }}
          ns={'actions'}
          components={
            isRescue
              ? [
                  <code
                    key="0"
                    className="px-1 py-0.5 text-[90%] text-[#c7254e] bg-[#f9f2f4] rounded"
                  />,
                ]
              : []
          }
        />,
        true,
      );
    }

    addSuccess(
      t(`pci_instances_actions_${snakeCaseSection}_instance_success_message`, {
        name: instance?.name,
      }),
      true,
    );

    handleModalClose();
  };

  const onError = (rawError: unknown) => {
    const errorMessage = isApiErrorResponse(rawError)
      ? rawError.response?.data.message
      : (rawError as DefaultError).message;
    addError(
      t(`pci_instances_actions_${snakeCaseSection}_instance_error_message`, {
        name: instance?.name,
        error: errorMessage,
      }),
      true,
    );
    handleModalClose();
  };

  if (!instanceId || !section) return <NotFound />;

  const title = t(`pci_instances_actions_${snakeCaseSection}_instance_title`);

  const modalProps = {
    title,
    projectId,
    onError,
    onSuccess,
    handleModalClose,
    instance,
    isLoading,
  };

  if (section === 'backup') {
    return <BackupActionPage {...modalProps} section={'backup'} />;
  }

  if (section === 'rescue/start' || section === 'rescue/end') {
    return <RescueActionPage {...modalProps} section={section} />;
  }

  if (section === 'billing/monthly/activate') {
    return (
      <BillingMonthlyActionPage
        {...modalProps}
        section={'billing/monthly/activate'}
      />
    );
  }

  return <BaseInstanceActionPage {...modalProps} section={section} />;
};

export default InstanceAction;
