import {
  Links,
  LinkType,
  OnboardingLayout,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useEnableLogForwarder } from '@/data/hooks/useVmwareVsphereLogForwarder';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';
import { VMWareStatus } from '@/types/vsphere';
import { getDedicatedCloudServiceDatacenterQueryKey } from '@/data/api/hpc-vmware-vsphere-datacenter';
import { useVmwareDedicatedCloudTask } from '@/data/hooks/useVmwareDedicatedCloudTask';
import LogsActivationInProgress from './LogsActivationInProgress.component';
import { getDedicatedCloudServiceCompatibilityMatrixQueryKey } from '@/data/api/hpc-vmware-vsphere-compatibilityMatrix';

type LogsActivationProps = {
  datacenterId: number;
  currentStatus: VMWareStatus;
  serviceName: string;
  isUserTrusted: boolean;
};

const LogsActivation = ({
  datacenterId,
  currentStatus,
  serviceName,
  isUserTrusted,
}: LogsActivationProps) => {
  const { t } = useTranslation('onboarding');
  const { addInfo } = useNotifications();
  const [taskId, setTaskId] = useState<number | null>(null);
  const {
    mutate: enableLogForwarder,
    isPending: isEnableLogForwarderPending,
  } = useEnableLogForwarder(serviceName, {
    onSuccess: (data) => {
      setTaskId(data.data?.taskId);
    },
  });
  const { data: taskData } = useVmwareDedicatedCloudTask(serviceName, taskId);
  const guides = useGuideUtils(LANDING_URL);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      taskData &&
      ['done', 'error', 'canceled'].includes(taskData?.data.state)
    ) {
      queryClient.invalidateQueries({
        queryKey: getDedicatedCloudServiceDatacenterQueryKey(
          serviceName,
          datacenterId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: getDedicatedCloudServiceCompatibilityMatrixQueryKey(
          serviceName,
        ),
      });
    }
  }, [taskData]);

  useEffect(() => {
    if (currentStatus === VMWareStatus.MIGRATING) {
      addInfo(
        <div className="flex flex-col">
          <OdsText preset={ODS_TEXT_PRESET.heading4}>
            {t('logs_onboarding_migration_banner_title')}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('logs_onboarding_migration_banner_dscription')}
          </OdsText>
        </div>,
        false,
      );
    }
  }, [currentStatus]);

  if (
    (taskData &&
      !['done', 'error', 'canceled'].includes(taskData?.data.state)) ||
    isEnableLogForwarderPending
  )
    return <LogsActivationInProgress />;

  return (
    <OnboardingLayout
      title={t('logs_onboarding_default_title')}
      description={
        <>
          <OdsText preset="paragraph" className="text-center">
            {t('logs_onboarding_default_description')}{' '}
          </OdsText>
          <div className="flex flex-row gap-4 align-center">
            <OdsButton
              label={
                isUserTrusted
                  ? t('logs_onboarding_primary_cta_activate_snc')
                  : t('logs_onboarding_primary_cta_activate')
              }
              onClick={() => {
                enableLogForwarder();
              }}
              isDisabled={currentStatus === VMWareStatus.MIGRATING}
            ></OdsButton>
            <Links
              type={LinkType.external}
              label={t('logs_onboarding_secondary_cta')}
              target="_blank"
              href={guides?.logs_data_platform}
            />
          </div>
        </>
      }
    />
  );
};

export default LogsActivation;
