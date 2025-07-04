import { useMutation } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import { serviceToTerraform } from '@/data/api/database/terraform';
import { ServiceRequest } from '@/types/terraform/cloud/database';
import { Response } from '@/types/terraform/cloud';

export interface TuseServiceToTerraform {
  onError: (cause: CdbError) => void;
  onSuccess: (terraformData: Response) => void;
}
export function useServiceToTerraform({
  onError,
  onSuccess,
}: TuseServiceToTerraform) {
  const mutation = useMutation({
    mutationFn: (serviceData: ServiceRequest) => {
      return serviceToTerraform(serviceData);
    },
    onError,
    onSuccess,
  });

  return {
    serviceToTerraform: (serviceData: ServiceRequest) => {
      return mutation.mutate(serviceData);
    },
    ...mutation,
  };
}
