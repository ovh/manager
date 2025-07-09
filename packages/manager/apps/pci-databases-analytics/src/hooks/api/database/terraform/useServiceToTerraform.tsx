import { useMutation } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import { serviceToTerraform } from '@/data/api/database/terraform.api';
import { ServiceRequest } from '@/types/terraform/cloud/database';
import { Response as TerraformResponse } from '@/types/terraform/cloud';

export interface TuseServiceToTerraform {
  onError: (cause: CdbError) => void;
  onSuccess: (terraformData: TerraformResponse) => void;
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
