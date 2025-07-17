import { ANTI_AFFINITY_MAX_NODES, NODE_RANGE } from '@/constants';
import { isMonoDeploymentZone } from '.';
import { NodePoolMode, NodePoolState } from '@/types';
import { TRegionInformations } from '@/types/region';
import { AutoscalingState } from '@/components/Autoscaling.component';

export const exceedsMaxNodes = (quantity: number) => quantity > NODE_RANGE.MAX;

export const zoneAZisChecked = (
  regionInformations: TRegionInformations,
  nodePoolState: NodePoolState,
) =>
  isMonoDeploymentZone(regionInformations?.type) ||
  !!nodePoolState.selectedAvailabilityZone;

export const isScalingValid = (nodePoolState: NodePoolState) => {
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
    nodePoolState.scaling.quantity.desired <= ANTI_AFFINITY_MAX_NODES);

export const hasInvalidScalingOrAntiAffinityConfig = (
  regionInformations: TRegionInformations,
  nodePoolState: NodePoolState,
) =>
  !isScalingValid(nodePoolState) ||
  !hasMax5NodesAntiAffinity(nodePoolState) ||
  !zoneAZisChecked(regionInformations, nodePoolState);

const autoScaleObject = (scaling: AutoscalingState): NodePoolMode => ({
  antiAffinity: false,
  scaling: {
    ...scaling,
    isAutoscale: true,
  },
  mode: 'autoscale',
});
const initObject = (scaling: AutoscalingState): NodePoolMode => ({
  antiAffinity: false,
  scaling: {
    ...scaling,
    isAutoscale: false,
  },
  mode: 'initial',
});
export const antiaAffinityObject = (
  scaling: AutoscalingState,
): NodePoolMode => ({
  antiAffinity: true,
  scaling: {
    ...scaling,
    isAutoscale: false,
  },
  mode: 'antiAffinity',
});

export function resolveNodePoolMode(
  scaling: AutoscalingState,
  antiAffinity: boolean,
): NodePoolMode {
  if (antiAffinity) {
    return antiaAffinityObject(scaling);
  }

  if (scaling && scaling.isAutoscale) {
    return autoScaleObject(scaling);
  }

  return initObject(scaling);
}
