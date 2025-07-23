import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { ErrorBanner, Links, LinkType } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useVmwareVsphereCompatibilityMatrix } from '@/data/hooks/useVmwareVsphereCompatibilityMatrix';
import { useVmwareVsphereDatacenter } from '@/data/hooks/useVmwareVsphereDatacenter';
import { useVmwareVsphere } from '@/data/hooks/useVmwareVsphere';

import LogsActivation from './LogsActivation.component';
import LogsUpgrade from './LogsUpgrade.component';
import LogsActivationInProgress from './LogsActivationInProgress.component';
import { getVmwareStatus } from '@/utils/getVmwareStatus';
import { VMWareStatus } from '@/types/vsphere';
import { urls } from '@/routes/routes.constant';
import { getDedicatedCloudDatacenterListQueryKey } from '@/data/api/hpc-vmware-vsphere-datacenter';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { LANDING_URL } from '@/hooks/guide/guidesLinks.constants';

type LogsOnboardingProps = {
  children: React.ReactNode;
};

const FORWARDER_VALID_STATE = ['creating', 'pending', 'toCreate', 'updating'];

const LogsOnboarding = ({ children }: LogsOnboardingProps) => {
  const { t } = useTranslation('onboarding');
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { serviceName } = useParams();
  const guides = useGuideUtils(LANDING_URL);
  const { data: vmwareVsphere, isLoading: isLoadingVsphere } = useVmwareVsphere(
    serviceName,
  );
  const [isUserTrusted, setIsUserTrusted] = useState(false);
  const {
    data: datacenter,
    isLoading: isLoadingVsphereDatacenter,
    error: datacenterError,
    isError: isDatacenterError,
  } = useVmwareVsphereDatacenter(serviceName);
  const {
    data: compatibilityMatrix,
    isLoading: isCompatibilityMatrixLoading,
  } = useVmwareVsphereCompatibilityMatrix(serviceName);

  const currentStatus = getVmwareStatus({
    vsphereState: vmwareVsphere?.data?.state,
    datacenterCommentialName: datacenter?.commercialName,
  });

  const isLogForwarderDelivered = useMemo(() => {
    const options = compatibilityMatrix?.data ?? [];
    return options.some(
      (option) =>
        option.name === 'logForwarder' && option.state === 'delivered',
    );
  }, [compatibilityMatrix]);

  const getUserSNC = async () => {
    const env = await environment.getEnvironment();
    const { isTrusted } = env.getUser();
    setIsUserTrusted(isTrusted);
  };
  const islogForwarderIsCreating = useMemo(() => {
    return (compatibilityMatrix?.data ?? []).some(
      (option) =>
        option.name === 'logForwarder' &&
        FORWARDER_VALID_STATE.includes(option.state),
    );
  }, [compatibilityMatrix]);

  useEffect(() => {
    getUserSNC();
  }, [environment]);
  if (isDatacenterError) {
    return (
      <ErrorBanner
        error={datacenterError.response}
        onRedirectHome={() => navigate(urls.root)}
        onReloadPage={() =>
          queryClient.refetchQueries({
            queryKey: getDedicatedCloudDatacenterListQueryKey,
          })
        }
      />
    );
  }

  if (
    isLoadingVsphere ||
    isLoadingVsphereDatacenter ||
    isCompatibilityMatrixLoading
  ) {
    return (
      <div className="flex justify-center pt-10">
        <OdsSpinner />
      </div>
    );
  }

  if (isLogForwarderDelivered) {
    return (
      <>
        {isUserTrusted ? (
          <>
            <OdsText preset="heading-6">
              {t('logs_introduction_title_syslog')}
            </OdsText>
            <OdsText preset="paragraph">
              {t('logs_introduction_description_syslog')}
            </OdsText>{' '}
            <Links
              type={LinkType.external}
              label={t('logs_introduction_description_link')}
              href={guides?.logs_data_platform} // PLACEHOLDER WAITING FOR REAL GUIDES
              target="_blank"
            />
          </>
        ) : (
          <>
            <div className="mb-4">
              <OdsText preset="heading-6">
                {t('logs_introduction_title')}
              </OdsText>
              <OdsText preset="paragraph" className="mb-4">
                {t('logs_introduction_description_ldp')}
              </OdsText>
              <OdsText preset="paragraph">
                {t('logs_introduction_description_syslog')}
              </OdsText>{' '}
              <Links
                type={LinkType.external}
                label={t('logs_introduction_description_link')}
                href={guides?.logs_data_platform} // PLACEHOLDER WAITING FOR REAL GUIDES
                target="_blank"
              />
            </div>
            {children}
          </>
        )}
      </>
    );
  }

  if (islogForwarderIsCreating) {
    return <LogsActivationInProgress />;
  }

  if (
    currentStatus === VMWareStatus.MIGRATING ||
    currentStatus === VMWareStatus.PREMIER
  ) {
    return (
      <LogsActivation
        currentStatus={currentStatus}
        serviceName={serviceName}
        datacenterId={datacenter?.datacenterId}
        isUserTrusted={isUserTrusted}
      />
    );
  }

  if (currentStatus === VMWareStatus.ESSENTIALS) {
    return <LogsUpgrade />;
  }
  return <></>;
};

export default LogsOnboarding;
