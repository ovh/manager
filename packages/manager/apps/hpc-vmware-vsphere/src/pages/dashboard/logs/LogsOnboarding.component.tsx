import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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
import LogsOnboardingForTrustedUser from './LogsOnboardingForTrustedUser.component';
import LogsOnboardingForCommonUser from './LogsOnboardingForCommonUser.component';

type LogsOnboardingProps = {
  children: React.ReactNode;
};

const FORWARDER_VALID_STATE = ['creating', 'pending', 'toCreate', 'updating'];

const LogsOnboarding = ({ children }: LogsOnboardingProps) => {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { serviceName } = useParams();
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

  const updateUserSNC = async () => {
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
    updateUserSNC();
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
          <LogsOnboardingForTrustedUser />
        ) : (
          <LogsOnboardingForCommonUser>{children}</LogsOnboardingForCommonUser>
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
