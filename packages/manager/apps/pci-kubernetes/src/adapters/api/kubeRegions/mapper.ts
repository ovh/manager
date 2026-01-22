import { TKubeRegions } from '@/domain/entities/kubeRegion';

import { TKubeRegionsDTO } from './dto.types';

export const mapKubeRegionsToEntity = (kubeRegionsDto: TKubeRegionsDTO): TKubeRegions => {
  return kubeRegionsDto.map((region) => region);
};
