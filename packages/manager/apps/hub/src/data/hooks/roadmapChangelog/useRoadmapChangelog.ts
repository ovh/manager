import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getRoadmapChangelog } from '@/data/api/roadmapChangelog';

export const useRoadmapChangelog = () =>
  useQuery<any, AxiosError>({
    queryKey: ['getRoadmapChangelog'],
    queryFn: () => getRoadmapChangelog(),
    retry: 0,
  });
