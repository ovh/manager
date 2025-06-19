import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { useVmwareVsphereCompatibilityMatrix } from '@/data/hooks/useVmwareVsphereCompatibilityMatrix';
import { useVmwareVsphereDatacenter } from '@/data/hooks/useVmwareVsphereDatacenter';
import { useVmwareVsphere } from '@/data/hooks/useVmwareVsphere';
import { VMWareState } from '@/types/vsphere';
import { getCommercialType } from '@/utils/getCommercialType';
import LogsActivation from './LogsActivation.component';
import LogsUpgrade from './LogsUpgrade.component';
import LogsActivationInProgress from './LogsActivationInProgress.component';

export enum VMWareStatus {
  MIGRATING,
  ESSENTIALS,
  PREMIER,
  PREMIER_ACTIVATION,
  SNC,
}

type LogsOnboardingProps = {
  children: React.ReactNode;
};

const LogsOnboarding = ({ children }: LogsOnboardingProps) => {
  const { serviceName } = useParams();
  const [currentStatus, setCurrentStatus] = useState<VMWareStatus>();
  const { data: vmwareVsphere, isLoading: isLoadingVsphere } = useVmwareVsphere(
    serviceName,
  );
  const [isLogForwarderDelivered, setIsLogForwarderDelivered] = useState<
    boolean
  >(false);
  const [islogForwarderIsCreating, setIslogForwarderIsCreating] = useState<
    boolean
  >(false);
  const {
    datacenter,
    isLoading: isLoadingVsphereDatacenter,
  } = useVmwareVsphereDatacenter(serviceName);
  const {
    data: compatibilityMatrix,
    isLoading: compatibilityMatrixIsLoading,
  } = useVmwareVsphereCompatibilityMatrix(serviceName);

  useEffect(() => {
    if (vmwareVsphere?.data?.state === VMWareState.Migrating) {
      setCurrentStatus(VMWareStatus.MIGRATING);
    } else if (getCommercialType(datacenter?.commercialName) === 'ESSENTIAL') {
      setCurrentStatus(VMWareStatus.ESSENTIALS);
    } else if (getCommercialType(datacenter?.commercialName) === 'PREMIER') {
      setCurrentStatus(VMWareStatus.PREMIER);
    }
  }, [vmwareVsphere, datacenter]);

  useEffect(() => {
    const options = compatibilityMatrix?.data ?? [];
    const isDelivered = options.some(
      (option) =>
        option.name === 'logForwarder' && option.state === 'delivered',
    );
    setIsLogForwarderDelivered(isDelivered);
    const validStates = ['creating', 'pending', 'toCreate', 'updating'];

    const isCreating = (compatibilityMatrix?.data ?? []).some(
      (option) =>
        option.name === 'logForwarder' && validStates.includes(option.state),
    );

    setIslogForwarderIsCreating(isCreating);
  }, [compatibilityMatrix]);

  if (
    isLoadingVsphere ||
    isLoadingVsphereDatacenter ||
    compatibilityMatrixIsLoading
  ) {
    return (
      <div className="flex justify-center pt-10">
        <OdsSpinner />
      </div>
    );
  }

  if (isLogForwarderDelivered) {
    return <>{children}</>;
  }

  if (islogForwarderIsCreating) {
    return <LogsActivationInProgress />;
  }

  if (
    currentStatus === VMWareStatus.MIGRATING ||
    currentStatus === VMWareStatus.PREMIER
  ) {
    return (
      <LogsActivation currentStatus={currentStatus} serviceName={serviceName} />
    );
  }

  if (currentStatus === VMWareStatus.ESSENTIALS) {
    return <LogsUpgrade />;
  }
  return <></>;
};

export default LogsOnboarding;
