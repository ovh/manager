import type { InfiniteData } from '@tanstack/react-query';
import type { NashaServiceDto } from '@/types/Nasha.api.type';
import type { NashaService } from '@/types/Nasha.type';

/**
 * Transform NashaServiceDto from API to NashaService entity
 * @param dto - Data Transfer Object from API
 * @returns Transformed entity for application use
 */
export function transformNashaService(dto: NashaServiceDto): NashaService {
  return {
    serviceName: dto.serviceName,
    canCreatePartition: dto.canCreatePartition,
    customName: dto.customName,
    datacenter: dto.datacenter,
    diskType: dto.diskType,
    monitored: dto.monitored,
    zpoolCapacity: dto.zpoolCapacity,
    zpoolSize: dto.zpoolSize,
  };
}

/**
 * Selector to transform infinite query data from DTOs to entities
 * Separates fetch logic from transformation logic
 * @param data - InfiniteData from useInfiniteQuery
 * @param limit - Page size limit
 * @returns Flattened array of transformed entities
 */
export function nashaServicesSelector(
  data: InfiniteData<NashaServiceDto[], number>,
  limit: number,
): NashaService[] {
  return data.pages
    .flatMap((page) => (page.length > limit ? page.slice(0, limit) : page))
    .map((dto) => transformNashaService(dto));
}

