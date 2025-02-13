import { v6 } from '@ovh-ux/manager-core-api';

export type TIssueType = {
  fields: {
    default: string;
    description: string;
    id: number;
    label: string;
    mandatory: boolean;
    rank: number;
    readOnly: boolean;
  }[];
  hasChildren: boolean;
  id: number;
  label: string;
  rank: number;
  readOnly: boolean;
  selfCareResources: {
    id: number;
    label: string;
    rank: number;
    tip: string;
    type: string;
    url: string;
  }[];
  subject: string;
};

export const getIssueTypes = async (
  language: string,
): Promise<TIssueType[]> => {
  const url = `/support/issueTypes?category=assistance&language=${language}&serviceType=cloud_project`;
  const { data } = await v6.get(url);
  return data;
};
