import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import { getSAPInstallations } from '@/data/api/sapInstallations';
import { useVMwareServices } from '@/hooks/vmwareServices/useVMwareServices';
import { TSAPInstallationWithService } from '@/types/installation.type';

export const installationHistoryQueryKeys = [
  'sap-features-hub',
  `/dedicatedCloud/sap`,
];

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
        queryKey: [...installationHistoryQueryKeys, serviceName],
        queryFn: async () => {
          const res = await getSAPInstallations(serviceName);
          const extendedInstallations: TSAPInstallationWithService[] = res.data.map(
            (installation) => ({ ...installation, serviceName }),
          );

          return { ...res, data: extendedInstallations };
        },
        enabled: !!services,
        retry: false,
      })) ?? [],

    combine: (
      results: UseQueryResult<
        ApiResponse<TSAPInstallationWithService[]>,
        Error
      >[],
    ) => ({
      data: results.flatMap(({ data: result }) => result?.data ?? []),
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
