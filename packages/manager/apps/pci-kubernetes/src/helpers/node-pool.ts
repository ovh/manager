import { ANTI_AFFINITY_MAX_NODES, NODE_RANGE } from '@/constants';
import { DeploymentMode, TScalingState } from '@/types';

type TScalingStateTest = {
  antiAffinity: boolean;
  scaling: TScalingState;
  selectedAvailabilityZones: { checked: boolean; zone: string }[] | null;
};

export const exceedsMaxNodes = (quantity: number) => quantity > NODE_RANGE.MAX;

export const isZoneAzChecked = (
  selectedAvailabilityZones: { checked: boolean; zone: string }[] | null,
) =>
  !selectedAvailabilityZones?.length || !!selectedAvailabilityZones?.some((zone) => zone.checked);

export const isScalingValid = (scaling: TScalingState) => {
  if (!scaling) return true;

  const { isAutoscale, quantity } = scaling;
  const { desired, min, max } = quantity;

  if (!isAutoscale) {
    return !exceedsMaxNodes(desired);
  }

  const isMinValid = min >= 0 && min <= max;
  const isMaxValid = max <= NODE_RANGE.MAX;
  const isDesiredInRange = min <= desired && max >= desired;

  return isMinValid && isMaxValid && isDesiredInRange;
};

export const hasMax5NodesAntiAffinity = ({
  antiAffinity,
  scaling,
}: {
  antiAffinity: boolean;
  scaling: TScalingState;
}) =>
  !antiAffinity ||
  (antiAffinity && scaling && scaling.quantity.desired <= ANTI_AFFINITY_MAX_NODES) ||
  false;

export const hasInvalidScalingOrAntiAffinityConfig = (nodePoolState: TScalingStateTest) =>
  !isScalingValid(nodePoolState.scaling) ||
  !hasMax5NodesAntiAffinity({
    antiAffinity: nodePoolState?.antiAffinity,
    scaling: nodePoolState.scaling,
  }) ||
  !isZoneAzChecked(nodePoolState.selectedAvailabilityZones);

export const getPlanCodeFloatingIps = (
  time: 'hour' | 'month',
  deploymentMode: DeploymentMode | null,
): string | null => {
  if (!deploymentMode) {
    return null;
  }

  return `floatingip.floatingip.${time}.consumption${
    deploymentMode === DeploymentMode.MULTI_ZONES && time !== 'month' ? '.3AZ' : ''
  }`;
};
