import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import {
  SlotType,
  getZimbraPlatformSlot,
  getZimbraPlatformSlotQueryKey,
  makeSlotService,
} from '@/data/api';

import { useSlotService } from '../services/useSlotService';
import { SlotWithService } from './useSlots';

type UseSlotParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  slotId?: string;
};

export const useSlot = (props: UseSlotParams = {}) => {
  const { slotId, ...options } = props;
  const { platformId, slotId: paramsId } = useParams();
  const [searchParams] = useSearchParams();
  const id = slotId || paramsId || searchParams.get('slotId');
  return useQuery({
    queryKey: getZimbraPlatformSlotQueryKey(platformId, id),
    queryFn: () => getZimbraPlatformSlot(platformId, id),
    ...options,
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!id &&
      !!platformId,
  }) as UseQueryResult<SlotType>;
};

export const useSlotWithService = (options: UseSlotParams = {}) => {
  const [slotWithService, setSlotWithService] = useState<SlotWithService>();
  const { data: slot, isLoading: isLoadingSlot } = useSlot(options);
  const { data: service, isLoading: isLoadingServices } = useSlotService({
    gcTime: 0,
    ...(options.enabled ? { enabled: options.enabled } : {}),
  });

  useEffect(() => {
    if (slot && service) {
      setSlotWithService({
        id: slot.id,
        offer: slot.currentState.offer,
        email: slot.currentState.email,
        service: makeSlotService(service),
      });
    }
  }, [slot, service]);

  return {
    slotWithService,
    isLoading: isLoadingSlot || isLoadingServices,
  };
};
