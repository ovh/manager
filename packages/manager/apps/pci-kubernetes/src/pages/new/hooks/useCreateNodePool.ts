import { useCallback, useEffect, useState } from 'react';

import { useParam } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly } from '@ovh-ux/manager-react-components';

import { useRegionInformations } from '@/api/hooks/useRegionInformations';
import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';
import { NODE_RANGE, TAGS_BLOB } from '@/constants';
import { checkIfNameExists, generateUniqueName } from '@/helpers';
import { isNodePoolNameValid } from '@/helpers/matchers/matchers';
import { hasInvalidScalingOrAntiAffinityConfig } from '@/helpers/node-pool';
import useMergedFlavorById, { getPriceByDesiredScale } from '@/hooks/useMergedFlavorById';
import { NodePoolPrice, NodePoolState } from '@/types';

function generateUniqueNameWithZone(
  baseName: string,
  zoneName: string | null,
  existingNodePools: NodePoolPrice[],
  multipleNodes: boolean,
) {
  const zoneSuffix = zoneName?.split('-').pop();
  const nameWithSuffix = zoneSuffix && multipleNodes ? `${baseName}-${zoneSuffix}` : baseName;

  const nameExists = checkIfNameExists(nameWithSuffix, existingNodePools);

  if (nameExists) {
    throw new Error('Le nom de nodepool est déjà utilisé. Veuillez en choisir un autre.');
  }
  return generateUniqueName(nameWithSuffix, existingNodePools);
}

const useCreateNodePools = ({ name, isLocked }: { name?: string; isLocked: boolean }) => {
  const [nodes, setNodes] = useState<NodePoolPrice[] | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<TComputedKubeFlavor | null>(null);

  const [isMonthlyBilled, setIsMonthlyBilled] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const selectedAvailabilityZones = nodePoolState.selectedAvailabilityZones?.filter(
    ({ checked }) => checked,
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

          nodePoolState.scaling?.quantity.desired * (selectedAvailabilityZones?.length ?? 1),
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, [nodes, nodePoolState, selectedFlavor, name, isMonthlyBilled, price]);

  const isValidName = isNodePoolNameValid(nodePoolState.name);

  const isNodePoolValid = !nodePoolEnabled || (Boolean(selectedFlavor) && isValidName);

  const isButtonDisabled =
    !isNodePoolValid ||
    (regionInformations &&
      hasInvalidScalingOrAntiAffinityConfig(regionInformations?.type, nodePoolState));

  const isPricingComingSoon = selectedFlavor?.blobs?.tags?.includes(TAGS_BLOB.COMING_SOON);

  const isStepUnlocked = !isLocked;

  const canSubmit =
    (isStepUnlocked && !nodePoolEnabled) ||
    (isStepUnlocked && nodePoolEnabled && Array.isArray(nodes) && nodes.length > 0);

  useEffect(() => setIsMonthlyBilled(false), [selectedFlavor]);

  useEffect(
    () =>
      setError(
        !isValidName && nodePoolState.isTouched
          ? 'kube_add_node_pool_name_input_pattern_validation_error'
          : null,
      ),
    [isValidName, nodePoolState.isTouched],
  );

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
      error,
      isNodePoolValid,
      isButtonDisabled,
      isPricingComingSoon,
      isStepUnlocked,
      canSubmit,
    },
  };
};

export default useCreateNodePools;
