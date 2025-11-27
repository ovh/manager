import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Translation } from 'react-i18next';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { createNodePool } from '@/api/data/node-pools';
import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';
import queryClient from '@/queryClient';
import {
  TAttachFloatingIPs,
  TCreateNodePoolParam,
  TScalingState,
  TSelectedAvailabilityZones,
} from '@/types';

interface NodePoolFormData {
  name: string;
  flavor?: TComputedKubeFlavor;
  selectedAvailabilityZones?: TSelectedAvailabilityZones | null;
  antiAffinity: boolean;
  isMonthlyBilling: boolean;
  attachFloatingIPs?: TAttachFloatingIPs | null;
  scaling?: TScalingState;
}

export function useNodePoolCreation(
  projectId: string,
  clusterId: string,
  { onSuccess, onError }: { onSuccess?: () => void; onError?: (e: ApiError) => void },
) {
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const [isAdding, setIsAdding] = useState(false);

  const create = (formData: NodePoolFormData, onTrack: () => void) => {
    onTrack();

    setIsAdding(true);

    const param: TCreateNodePoolParam = {
      flavorName: formData.flavor?.name || '',
      ...(formData.selectedAvailabilityZones && {
        availabilityZones: formData.selectedAvailabilityZones
          .filter(({ checked }) => checked)
          .map(({ zone }) => zone),
      }),
      name: formData.name,
      antiAffinity: formData.antiAffinity,
      monthlyBilled: formData.isMonthlyBilling,
      ...(formData.attachFloatingIPs && { attachFloatingIPs: formData.attachFloatingIPs }),
      autoscale: Boolean(formData.scaling?.isAutoscale),
      ...(Boolean(formData.scaling?.isAutoscale) && {
        minNodes: formData.scaling?.quantity.min ?? 0,
        maxNodes: formData.scaling?.quantity.max,
      }),
      desiredNodes: formData.scaling?.quantity.desired ?? 0,
    };

    createNodePool(projectId, clusterId, param)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ['project', projectId, 'kubernetes', clusterId, 'nodePools'],
        });
        onSuccess?.();
      })
      .catch((e) => {
        onError?.(e);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  return { create, isAdding };
}
