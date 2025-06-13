import { InfiniteData } from '@tanstack/react-query';
import { TInstanceDto } from '@/types/instance/api.type';
import { TInstance } from '@/types/instance/entity.type';
import { mapInstanceDto } from '../mapper/instance.mapper';

export const instancesSelector = (
  { pages }: InfiniteData<TInstanceDto[], number>,
  limit: number,
  projectUrl: string,
): TInstance[] =>
  pages
    .flatMap((page) => (page.length > limit ? page.slice(0, limit) : page))
    .map((instanceDto) => mapInstanceDto(instanceDto, projectUrl));
