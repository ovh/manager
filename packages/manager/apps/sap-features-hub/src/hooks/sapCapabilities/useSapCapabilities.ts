import { useQuery } from '@tanstack/react-query';
import { getSapCapabilities } from '@/data/api/sapCapabilities';
import { SapCapabilities, SAPRole } from '@/types/sapCapabilities.type';
import {
  APPLICATION_TYPES,
  APPLICATION_VERSIONS,
  DEPLOYMENT_TYPES,
} from '@/pages/installation/stepDeployment/installationStepDeployment.constants';

type MockedSapCapabilities = {
  data: SapCapabilities;
  isLoading: boolean;
  isError: boolean;
};

export const SAP_ROLES: SAPRole[] = ['SCS', 'CI', 'ERS', 'DI'];

export const useMockSapCapabilities = (): MockedSapCapabilities => ({
  data: {
    applicationTypes: APPLICATION_TYPES,
    applicationVersions: APPLICATION_VERSIONS,
    deploymentTypes: DEPLOYMENT_TYPES,
    ovaTemplates: ['OVA Template 1', 'OVA Template 2', 'OVA Template 3'],
    sapRoles: SAP_ROLES,
  },
  isLoading: false,
  isError: false,
});

// TODO: implement API calls when developed
export const useSapCapabilities = (serviceName: string) =>
  useQuery({
    queryKey: ['applicationVersions', serviceName],
    queryFn: () => getSapCapabilities(serviceName),
    select: (res) => res.data,
    enabled: !!serviceName,
  });
