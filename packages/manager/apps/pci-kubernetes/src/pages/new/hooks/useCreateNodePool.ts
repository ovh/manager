import { useCallback, useEffect, useState } from 'react';

import { useParam } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly } from '@ovh-ux/manager-react-components';

import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';
import { NODE_RANGE, TAGS_BLOB } from '@/constants';
import { ensureNameIsUnique, generateUniqueName } from '@/helpers';
import { hasInvalidScalingOrAntiAffinityConfig } from '@/helpers/node-pool';
import useMergedFlavorById, { getPriceByDesiredScale } from '@/hooks/useMergedFlavorById';
import { NodePoolPrice, NodePoolState } from '@/types';

import { useNodePoolErrors } from './useNodePoolErrors';

function generateUniqueNameWithZone(
  baseName: string,
  zoneName: string | null,
  existingNodePools: NodePoolPrice[],
  multipleNodes: boolean,
) {
  const zoneSuffix = zoneName?.split('-').pop();
  const nameWithSuffix = zoneSuffix && multipleNodes ? `${baseName}-${zoneSuffix}` : baseName;

  ensureNameIsUnique(nameWithSuffix, existingNodePools);

  return generateUniqueName(nameWithSuffix, existingNodePools);
}

function canSubmitNodePools(
  isStepUnlocked: boolean,
  nodePoolEnabled: boolean,
  nodes: NodePoolPrice[] | null,
): boolean {
  if (!isStepUnlocked) return false;

  if (!nodePoolEnabled) return true;

  return Array.isArray(nodes) && nodes.length > 0;
}

const useCreateNodePools = ({ name, isLocked }: { name?: string; isLocked: boolean }) => {
  const [nodes, setNodes] = useState<NodePoolPrice[] | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<TComputedKubeFlavor | null>(null);

  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);
  const [nodePoolState, setNodePoolState] = useState<NodePoolState>({
    antiAffinity: false,
    name: '',
    isTouched: false,
    scaling: {
      quantity: { desired: NODE_RANGE.MIN, min: 0, max: NODE_RANGE.MAX },
      isAutoscale: false,
    },
  });
  const { projectId } = useParam('projectId');
  const [nodePoolEnabled, setNodePoolEnabled] = useState(true);
  const { data: regionInformations } = useRegionInformations(projectId, name ?? null);

  const { error, isValidName, handleCreationError, clearExistsError } = useNodePoolErrors(
    nodePoolState,
    nodes,
  );

  const price = useMergedFlavorById<{ hour: number; month?: number } | null>(
    projectId,
    name ?? null,
    selectedFlavor?.id ?? null,
    {
      select: (flavor) =>
        getPriceByDesiredScale(
          flavor.pricingsHourly?.price,
          flavor.pricingsMonthly?.price,
          nodePoolState.scaling?.quantity.desired,
        ),
    },
  );

  const createNodePool = useCallback(() => {
    if (!nodes || !nodePoolState.scaling || !selectedFlavor) return;

    const selectedZones = nodePoolState.selectedAvailabilityZones?.filter((zone) => zone.checked);

    const createDataNodePool = ({ zone }: { zone?: string } = {}): NodePoolPrice => ({
      name: generateUniqueNameWithZone(
        nodePoolState.name,
        zone ?? null,
        nodes,
        !!(selectedZones?.length && selectedZones?.length >= 2),
      ),
      antiAffinity: nodePoolState.antiAffinity,
      autoscale: nodePoolState.scaling.isAutoscale,
      ...(zone && { availabilityZones: [zone] }),
      localisation: zone ?? name ?? null,
      desiredNodes: nodePoolState.scaling.quantity.desired,
      ...(nodePoolState.scaling.isAutoscale && {
        minNodes: nodePoolState.scaling.quantity.min,
        maxNodes: nodePoolState.scaling.quantity.max,
      }),
      flavorName: selectedFlavor.name ?? '',
      monthlyPrice: isMonthlyBilled
        ? (price?.month ?? 0)
        : convertHourlyPriceToMonthly(price?.hour ?? 0),
      monthlyBilled: isMonthlyBilled,
    });

    try {
      const newNodePools = selectedZones?.length
        ? selectedZones.filter((zone) => zone.checked).map(createDataNodePool)
        : [createDataNodePool()];

      setNodes([...nodes, ...newNodePools]);

      setNodePoolState((state) => ({
        ...state,
        name: '',
        isTouched: false,
      }));
      clearExistsError();
    } catch (err) {
      handleCreationError(err);
    }
  }, [
    nodes,
    nodePoolState,
    selectedFlavor,
    name,
    isMonthlyBilled,
    price,
    clearExistsError,
    handleCreationError,
  ]);

  const isNodePoolValid =
    !nodePoolEnabled || (Boolean(selectedFlavor) && isValidName && !error?.exists);

  const isButtonDisabled =
    !isNodePoolValid ||
    (regionInformations &&
      hasInvalidScalingOrAntiAffinityConfig(regionInformations?.type, nodePoolState));

  const isPricingComingSoon = selectedFlavor?.blobs?.tags?.includes(TAGS_BLOB.COMING_SOON);

  const isStepUnlocked = !isLocked;

  const canSubmit = canSubmitNodePools(isStepUnlocked, nodePoolEnabled, nodes);

  useEffect(() => setIsMonthlyBilled(false), [selectedFlavor]);

  useEffect(() => {
    if (regionInformations?.availabilityZones.length) {
      setNodePoolState((state) => ({
        ...state,
        selectedAvailabilityZones: regionInformations?.availabilityZones.map((zone) => ({
          zone,
          checked: true,
        })),
      }));
    }
  }, [regionInformations?.availabilityZones, setNodePoolState]);

  useEffect(() => {
    setNodes(!nodePoolEnabled ? null : []);
    if (!nodePoolEnabled) {
      setNodePoolState((state) => ({
        ...state,

        name: '',
        isTouched: false,
      }));
    }
  }, [nodePoolEnabled, setNodePoolState, setNodes]);

  const onDelete = useCallback(
    (nameToDelete: string) => nodes && setNodes(nodes.filter((node) => node.name !== nameToDelete)),
    [nodes],
  );

  return {
    state: {
      nodes,
      nodePoolState,
      selectedFlavor,
      isMonthlyBilled,
      nodePoolEnabled,
      price,
    },

    actions: {
      setNodes,
      setNodePoolState,
      setSelectedFlavor,
      setIsMonthlyBilled,
      setNodePoolEnabled,
      createNodePool,
      onDelete,
    },

    view: {
      isValidName,
      error: error ? Object.values(error).find((err) => err) : null,
      isNodePoolValid,
      isButtonDisabled,
      isPricingComingSoon,
      isStepUnlocked,
      canSubmit,
    },
  };
};

export default useCreateNodePools;
