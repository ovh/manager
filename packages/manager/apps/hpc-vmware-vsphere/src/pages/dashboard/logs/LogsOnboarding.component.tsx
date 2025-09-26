import { useNavigate, useParams } from 'react-router-dom';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useVmwareVsphereCompatibilityMatrixOptions } from '@/data/hooks/useVmwareVsphereCompatibilityMatrix';
import { useVmwareVsphereDatacenter } from '@/data/hooks/useVmwareVsphereDatacenter';
import { useVmwareVsphere } from '@/data/hooks/useVmwareVsphere';

import LogsActivation from './LogsActivation.component';
import LogsUpgrade from './LogsUpgrade.component';
import LogsActivationInProgress from './LogsActivationInProgress.component';
import { getVmwareStatus } from '@/utils/getVmwareStatus';
import { urls } from '@/routes/routes.constant';
import { getDedicatedCloudDatacenterListQueryKey } from '@/data/api/hpc-vmware-vsphere-datacenter';
import LogsOnboardingForTrustedUser from './LogsOnboardingForTrustedUser.component';
import LogsOnboardingForCommonUser from './LogsOnboardingForCommonUser.component';
import { useIsUserTrusted } from '@/hooks/useIsUserTrusted';
import { getIsLogForwarderDelivered } from '@/utils/vmwareVsphereCompatibilityMatrixUtils/getIsLogForwarderDelivered';
import { getIsLogForwarderCreating } from '@/utils/vmwareVsphereCompatibilityMatrixUtils/getIsLogForwarderCreating';
import { getLogsViewState } from '@/utils/logsOnboardingViewState';

type LogsOnboardingProps = {
  children: React.ReactNode;
};

const LogsOnboarding = ({ children }: LogsOnboardingProps) => {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { serviceName } = useParams();
  const { data: vmwareVsphere, isLoading: isLoadingVsphere } = useVmwareVsphere(
    serviceName,
  );
  const {
    data: isUserTrusted,
    isLoading: isUserTrustedLoading,
  } = useIsUserTrusted();
  const {
    data: datacenter,
    isLoading: isLoadingVsphereDatacenter,
    error: datacenterError,
    isError: isDatacenterError,
  } = useVmwareVsphereDatacenter(serviceName);
  const vmwareVsphereCompatibilityMatrixOptions = useVmwareVsphereCompatibilityMatrixOptions(
    serviceName,
  );
  const {
    data: vmwareVsphereCompatibilityMatrixData,
    isLoading: isCompatibilityMatrixLoading,
  } = useQuery({
    ...vmwareVsphereCompatibilityMatrixOptions,
    select: ({ data }) => ({
      isLogForwarderDelivered: getIsLogForwarderDelivered(data),
      isLogForwarderIsCreating: getIsLogForwarderCreating(data),
    }),
  });
  const currentStatus = getVmwareStatus({
    vsphereState: vmwareVsphere?.data?.state,
    datacenterCommercialName: datacenter?.commercialName,
  });

  const viewState = getLogsViewState({
    isDatacenterError,
    isLoadingVsphere,
    isLoadingVsphereDatacenter,
    isCompatibilityMatrixLoading,
    isUserTrustedLoading,
    isLogForwarderDelivered:
      vmwareVsphereCompatibilityMatrixData?.isLogForwarderDelivered,
    isLogForwarderIsCreating:
      vmwareVsphereCompatibilityMatrixData?.isLogForwarderIsCreating,
    isUserTrusted,
    currentStatus,
  });

  if (viewState === 'isError') {
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

  if (viewState === 'isLoading') {
    return (
      <div className="flex justify-center pt-10">
        <OdsSpinner />
      </div>
    );
  }

  if (viewState === 'onboardingTrustedUser') {
    return <LogsOnboardingForTrustedUser />;
  }

  if (viewState === 'onboardingCommonUser') {
    return (
      <LogsOnboardingForCommonUser>{children}</LogsOnboardingForCommonUser>
    );
  }

  if (viewState === 'LogsActivationInProgress') {
    return <LogsActivationInProgress />;
  }

  if (viewState === 'NeedLogsActivation') {
    return (
      <LogsActivation
        currentStatus={currentStatus}
        serviceName={serviceName}
        datacenterId={datacenter?.datacenterId}
        isUserTrusted={isUserTrusted}
      />
    );
  }

  if (viewState === 'NeedLogsUpdate') {
    return <LogsUpgrade />;
  }

  return (
    <ErrorBanner
      error={{ data: { message: t('logs_onboarding_state_error_text') } }}
      onRedirectHome={() => navigate(urls.root)}
      onReloadPage={() =>
        queryClient.refetchQueries({
          queryKey: getDedicatedCloudDatacenterListQueryKey,
        })
      }
    />
  );
};

export default LogsOnboarding;
