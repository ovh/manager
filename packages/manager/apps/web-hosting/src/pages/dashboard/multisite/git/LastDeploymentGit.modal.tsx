import { Location, useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCode, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { Modal } from '@ovh-ux/manager-react-components';

import {
  useGetDeploymentLogs,
  useGetHostingWebsiteIds,
  useGetWebsiteDeployments,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

interface LastDeploymentGitModalState {
  serviceName: string;
  path?: string;
}

export default function LastDeploymentGitModal() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const { state } = useLocation() as Location<LastDeploymentGitModalState>;

  const {
    data: websiteIds,
    isFetching: isFetchingWebsiteIds,
    isError: isWebsiteError,
    error: websiteError,
    refetch: refetchWebsiteIds,
  } = useGetHostingWebsiteIds(state?.serviceName ?? '', state?.path);

  const websiteId = websiteIds?.[0];

  const {
    data: deployments,
    isFetching: isFetchingDeployments,
    isError: isDeploymentError,
    error: deploymentError,
    refetch: refetchDeployments,
  } = useGetWebsiteDeployments(state?.serviceName ?? '', websiteId);

  const deploymentId = deployments?.[0];

  const {
    data: logs,
    isFetching: isFetchingLogs,
    isError: isLogsError,
    error: logsError,
    refetch: refetchLogs,
  } = useGetDeploymentLogs(state?.serviceName ?? '', websiteId, deploymentId);

  const isFetching = isFetchingWebsiteIds || isFetchingDeployments || isFetchingLogs;
  const isError = isWebsiteError || isDeploymentError || isLogsError;
  const error = websiteError ?? deploymentError ?? logsError;

  const onClose = () => {
    navigate(-1);
  };

  const handleRefresh = async () => {
    if (isFetching) return;
    await refetchWebsiteIds();
    await refetchDeployments();
    await refetchLogs();
  };

  return (
    <Modal
      heading={t('last_deployment_git')}
      onDismiss={onClose}
      isOpen
      onPrimaryButtonClick={() => {
        void handleRefresh();
      }}
      onSecondaryButtonClick={onClose}
    >
      {isFetching ? (
        <div className="flex justify-center items-center h-48">
          <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
        </div>
      ) : isError ? (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {String(error?.message ?? t('common:unknown'))}
        </OdsText>
      ) : logs?.length ? (
        <OdsCode className="whitespace-pre-wrap break-words text-sm text-white">
          {logs?.map((log) => {
            const rawDate = log.date;
            const formattedDate =
              rawDate instanceof Date
                ? rawDate.toLocaleString()
                : rawDate
                  ? new Date(rawDate).toLocaleString()
                  : t('common:unknown');

            return (
              <span key={`${formattedDate}-${log.message ?? ''}`}>
                {`${formattedDate}: ${log.message ?? ''}`}
                <br />
              </span>
            );
          })}
        </OdsCode>
      ) : (
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('common:no_data')}</OdsText>
      )}
    </Modal>
  );
}
