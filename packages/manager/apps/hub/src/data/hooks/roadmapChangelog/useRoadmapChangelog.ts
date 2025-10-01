import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getRoadmapChangelog } from '@/data/api/roadmapChangelog';
import { RoadmapChangelogResponse } from '@/types/roadmapchangelog.type';

export const useRoadmapChangelog = () =>
  useQuery<RoadmapChangelogResponse, AxiosError>({
    queryKey: ['getRoadmapChangelog'],
    queryFn: () => getRoadmapChangelog(),
    retry: 0,
  });
