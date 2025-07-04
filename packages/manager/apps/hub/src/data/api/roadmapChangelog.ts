import { aapi } from '@ovh-ux/manager-core-api';

export const getRoadmapChangelog: () => Promise<any> = async () => {
  const { data } = await aapi.get<any>('/roadmap-changelog');
  return data;
};
