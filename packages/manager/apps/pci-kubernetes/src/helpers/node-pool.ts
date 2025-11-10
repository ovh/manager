import { ANTI_AFFINITY_MAX_NODES, NODE_RANGE } from '@/constants';
import { DeploymentMode, NodePoolState } from '@/types';

import { isMonoDeploymentZone } from '.';

export const exceedsMaxNodes = (quantity: number) => quantity > NODE_RANGE.MAX;

export const isZoneAzChecked = (type: DeploymentMode, nodePoolState: NodePoolState) =>
  !!isMonoDeploymentZone(type) ||
  !!nodePoolState.selectedAvailabilityZones?.some((zone) => zone.checked);

export const isScalingValid = (nodePoolState: Pick<NodePoolState, 'scaling'>) => {
  if (!nodePoolState.scaling) return true;

  const { isAutoscale, quantity } = nodePoolState.scaling;
  const { desired, min, max } = quantity;

  if (!isAutoscale) {
    return !exceedsMaxNodes(desired);
  }

  const isMinValid = min >= 0 && min <= max;
  const isMaxValid = max <= NODE_RANGE.MAX;
  const isDesiredInRange = min <= desired && max >= desired;

  return isMinValid && isMaxValid && isDesiredInRange;
};

export const hasMax5NodesAntiAffinity = (nodePoolState: NodePoolState) =>
  !nodePoolState.antiAffinity ||
  (nodePoolState.antiAffinity &&
    nodePoolState.scaling &&
    nodePoolState.scaling.quantity.desired <= ANTI_AFFINITY_MAX_NODES) ||
  false;

export const hasInvalidScalingOrAntiAffinityConfig = (
  type: DeploymentMode,
  nodePoolState: NodePoolState,
) =>
  !isScalingValid(nodePoolState) ||
  !hasMax5NodesAntiAffinity(nodePoolState) ||
  !isZoneAzChecked(type, nodePoolState);

export const getPlanCodeFloatingIps = (
  time: 'hour' | 'month',
  deploymentMode: DeploymentMode | null,
): string | null => {
  if ((deploymentMode === DeploymentMode.MULTI_ZONES && time === 'month') || !deploymentMode) {
    return null;
  }
  return `floatingip.floatingip.${time}.consumption${
    deploymentMode === DeploymentMode.MULTI_ZONES ? '.3AZ' : ''
  }`;
};
