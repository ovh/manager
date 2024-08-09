import { useResourcesIcebergV2 } from '@ovhcloud/manager-components';
import { VCDLocation } from '../vcd.type';

export const useRegions = () =>
  useResourcesIcebergV2<VCDLocation>({
    queryKey: ['/vmwareCloudDirector/reference/region'],
    route: '/vmwareCloudDirector/reference/region',
  });
