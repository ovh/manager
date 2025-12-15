import { useEffect, useState } from 'react';

import { ensureNameIsUnique } from '@/helpers';
import { isNodePoolNameValid } from '@/helpers/matchers/matchers';
import { NodePoolPrice, NodePoolState } from '@/types';

function generateUniqueNameWithZone(
  baseName: string,
  zoneName: string | null,
  existingNodePools: NodePoolPrice[],
  multipleNodes: boolean,
) {
  const zoneSuffix = zoneName?.split('-').pop();
  const nameWithSuffix = zoneSuffix && multipleNodes ? `${baseName}-${zoneSuffix}` : baseName;
  ensureNameIsUnique(nameWithSuffix, existingNodePools);
}

function validateNodePoolNameUniqueness({
  nodePoolName,
  selectedAvailabilityZones,
  nodes,
}: {
  nodePoolName: string;
  selectedAvailabilityZones?: { zone: string; checked: boolean }[] | null;
  nodes: NodePoolPrice[];
}) {
  if (!selectedAvailabilityZones?.length) {
    ensureNameIsUnique(nodePoolName, nodes);
    return;
  }

  const filterZones = selectedAvailabilityZones
    .filter((zone) => zone.checked)
    .map(({ zone }) => zone);

  if (!filterZones.length) {
    ensureNameIsUnique(nodePoolName, nodes);
    return;
  }

  filterZones.forEach((zoneName: string) => {
    generateUniqueNameWithZone(nodePoolName, zoneName, nodes, filterZones.length > 1);
  });
}

export function useNodePoolErrors(nodePoolState: NodePoolState, nodes: NodePoolPrice[] | null) {
  const [error, setError] = useState<{ valid?: string | null; exists?: string | null } | null>(
    null,
  );

  const isValidName = isNodePoolNameValid(nodePoolState.name);

  useEffect(() => {
    if (!nodes?.length) {
      return setError((prevError) => ({ ...prevError, exists: null }));
    }
    try {
      validateNodePoolNameUniqueness({
        nodePoolName: nodePoolState.name,
        selectedAvailabilityZones: nodePoolState.selectedAvailabilityZones,
        nodes,
      });
      setError((prevError) => ({ ...prevError, exists: null }));
    } catch (err) {
      setError((prevError) => ({
        ...prevError,
        exists: 'kube_add_node_pool_name_already_exist_validation_error',
      }));
    }
  }, [nodePoolState.selectedAvailabilityZones, nodePoolState.name, nodes]);

  useEffect(() => {
    setError((prevError) => {
      if (!isValidName && nodePoolState.isTouched) {
        return { ...prevError, valid: 'kube_add_node_pool_name_input_pattern_validation_error' };
      }
      return { ...prevError, valid: null };
    });
  }, [isValidName, nodePoolState.isTouched]);

  const handleCreationError = (err: unknown) => {
    if (err instanceof Error && err.message === 'name already exists') {
      setError((prevError) => ({
        ...prevError,
        exists: 'kube_add_node_pool_name_already_exist_validation_error',
      }));
    }
  };

  const clearExistsError = () => {
    setError((prevError) => ({
      ...prevError,
      exists: null,
    }));
  };

  return {
    error,
    isValidName,
    handleCreationError,
    clearExistsError,
  };
}
