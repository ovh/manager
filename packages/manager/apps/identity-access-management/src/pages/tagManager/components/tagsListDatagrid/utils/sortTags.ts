import { IamTagListItem } from '@/data/api/get-iam-tags';

export type SortTagsParams = {
  tags: IamTagListItem[];
  columnId: 'name' | 'count';
  desc: boolean;
};

export const sortTags = ({ tags, columnId, desc }: SortTagsParams) => {
  return tags.sort((tagA, tagB) => {
    if (desc) return tagA[columnId] < tagB[columnId] ? 1 : -1;
    return tagA[columnId] > tagB[columnId] ? 1 : -1;
  });
};
