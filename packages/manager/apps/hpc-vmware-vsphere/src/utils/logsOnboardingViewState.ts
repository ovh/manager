import { VMWareStatus } from '@/types/vsphere';

export type LogsViewState =
  | 'isError'
  | 'isLoading'
  | 'onboardingTrustedUser'
  | 'onboardingCommonUser'
  | 'LogsActivationInProgress'
  | 'NeedLogsActivation'
  | 'NeedLogsUpdate'
  | 'UnknownState';

export type LogsViewStateProps = {
  isDatacenterError: boolean;
  isLoadingVsphere: boolean;
  isLoadingVsphereDatacenter: boolean;
  isCompatibilityMatrixLoading: boolean;
  isUserTrustedLoading: boolean;
  isLogForwarderDelivered: boolean;
  isLogForwarderIsCreating: boolean;
  isUserTrusted: boolean;
  currentStatus: VMWareStatus;
};

export const getLogsViewState = ({
  isDatacenterError,
  isLoadingVsphere,
  isLoadingVsphereDatacenter,
  isCompatibilityMatrixLoading,
  isUserTrustedLoading,
  isLogForwarderDelivered,
  isLogForwarderIsCreating,
  isUserTrusted,
  currentStatus,
}: LogsViewStateProps): LogsViewState => {
  if (
    isLoadingVsphere ||
    isLoadingVsphereDatacenter ||
    isCompatibilityMatrixLoading ||
    isUserTrustedLoading
  )
    return 'isLoading';

  if (isDatacenterError) return 'isError';

  if (isLogForwarderDelivered && isUserTrusted) return 'onboardingTrustedUser';
  if (isLogForwarderDelivered && !isUserTrusted) return 'onboardingCommonUser';
  if (isLogForwarderIsCreating) return 'LogsActivationInProgress';
  if (
    currentStatus === VMWareStatus.MIGRATING ||
    currentStatus === VMWareStatus.PREMIER
  )
    return 'NeedLogsActivation';
  if (currentStatus === VMWareStatus.ESSENTIALS) return 'NeedLogsUpdate';
  return 'UnknownState';
};
