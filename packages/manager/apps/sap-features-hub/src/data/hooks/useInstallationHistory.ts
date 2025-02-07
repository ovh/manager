import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import { TSAPInstallation } from '@/types/installation.type';
import { getSAPInstallations } from '@/data/api/vmwareServices';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';

export default function useInstallationHistory() {
  const {
    data: services,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    isPending: isPendingServices,
  } = useVMwareServices();

  const installations = useQueries({
    queries:
      services?.map(({ serviceName }) => ({
        queryKey: ['sap-features-hub', `/dedicatedCloud/sap`, serviceName],
        queryFn: () => getSAPInstallations(serviceName),
        enabled: !!services,
        retry: false,
      })) ?? [],

    combine: (
      results: UseQueryResult<ApiResponse<TSAPInstallation[]>, Error>[],
    ) => ({
      data: results.map(({ data: result }) => result?.data)?.flat(),
      isLoading: results.some(({ isLoading }) => isLoading),
      isPending: results.some(({ isPending }) => isPending),
      isError: results.some(({ isError }) => isError),
    }),
  });

  return {
    data: installations.data.sort(
      (a, b) => Date.parse(b.startTime) - Date.parse(a.startTime),
    ),
    isError: installations.isError || isErrorServices,
    isLoading: installations.isLoading || isLoadingServices,
    isPending: installations.isPending || isPendingServices,
  };
}
