import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { VCDLocation } from '../vcd.type';

export const useRegions = () =>
  useResourcesIcebergV2<VCDLocation>({
    queryKey: ['/vmwareCloudDirector/reference/region'],
    route: '/vmwareCloudDirector/reference/region',
  });
