import { useMemo } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

import {
  canCreatePartitions,
  isNashaLegacyService,
  shouldReengage,
} from '@/utils/dashboard/calculate.utils';
import {
  goToEditName,
  goToPartitionsCreate,
  getDashboardUrl,
} from '@/utils/dashboard/navigation.utils';
import { NASHA_BASE_API_URL } from '@/pages/dashboard/Dashboard.constants';
import type { DashboardData, DashboardNavigation } from '@/types/Dashboard.type';

import { useNasha } from './useNasha';
import { usePartitionAllocatedSize } from './usePartitionAllocatedSize';
import { useServiceInfo } from './useServiceInfo';
import { useDashboardFeatureAvailability } from './useFeatureAvailability';

export function useDashboardData(): {
  data: DashboardData | undefined;
  navigation: DashboardNavigation;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
} {
  const { serviceName = '' } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: nasha, isLoading: isLoadingNasha, isError: isErrorNasha, error: errorNasha } = useNasha(serviceName);
  const {
    data: partitionAllocatedSize = 0,
    isLoading: isLoadingPartitions,
  } = usePartitionAllocatedSize(serviceName);
  const {
    data: serviceInfo,
    isLoading: isLoadingServiceInfo,
  } = useServiceInfo(serviceName);
  const {
    isCommitmentAvailable,
    isNashaLegacyServicesPeriod,
    isLoading: isLoadingFeatures,
  } = useDashboardFeatureAvailability();

  const isLoading =
    isLoadingNasha || isLoadingPartitions || isLoadingServiceInfo || isLoadingFeatures;

  const isError = isErrorNasha;
  const error = errorNasha;

  const data = useMemo<DashboardData | undefined>(() => {
    if (!nasha || !serviceInfo) {
      return undefined;
    }

    const canCreate = canCreatePartitions(partitionAllocatedSize, nasha);
    const isLegacyService = isNashaLegacyService(nasha);
    const isEolBannerAvailable =
      isNashaLegacyServicesPeriod && isLegacyService;
    const shouldReengageValue = shouldReengage(serviceInfo);
    const nashaApiUrl = `${NASHA_BASE_API_URL}/${serviceName}`;

    return {
      nasha,
      serviceInfo,
      partitionAllocatedSize,
      canCreatePartitions: canCreate,
      isCommitmentAvailable,
      isNashaEolServiceBannerAvailable: isEolBannerAvailable,
      shouldReengage: shouldReengageValue,
      nashaApiUrl,
    };
  }, [
    nasha,
    serviceInfo,
    partitionAllocatedSize,
    isCommitmentAvailable,
    isNashaLegacyServicesPeriod,
    serviceName,
  ]);

  const navigation = useMemo<DashboardNavigation>(
    () => ({
      goToEditName: () => goToEditName(serviceName, navigate),
      goToPartitionsCreate: () => goToPartitionsCreate(serviceName, navigate),
      reload: async (options?: { success?: string; error?: unknown }) => {
        // Invalidate queries to refetch data
        await queryClient.invalidateQueries({
          queryKey: ['nasha', serviceName],
        });
        // TODO: Handle success/error messages (alerts)
        if (options?.success) {
          // Show success message
        }
        if (options?.error) {
          // Show error message
        }
      },
    }),
    [serviceName, navigate, queryClient],
  );

  return {
    data,
    navigation,
    isLoading,
    isError,
    error,
  };
}

