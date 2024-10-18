import { AxiosResponse } from 'axios';
import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { getlicenseHycuService } from '@/data/api/hycu';
import { IHycuDetails } from '@/type/hycu.details.interface';

export const useDetailsLicenseHYCU = (
  serviceName: string,
  options?: DefinedInitialDataOptions<AxiosResponse<IHycuDetails>>,
) => {
  return useQuery({
    queryKey: ['license/hycu', 'get', serviceName],
    queryFn: () => getlicenseHycuService({ serviceName }),
    ...(options ?? {}),
  });
};
