import { aapi } from '@ovh-ux/manager-core-api';

import { RoadmapChangelogResponse } from '@/types/roadmapchangelog.type';

export const getRoadmapChangelog: () => Promise<RoadmapChangelogResponse> = async () => {
  const { data } = await aapi.get<RoadmapChangelogResponse>('/roadmap-changelog');
  return data;
};
