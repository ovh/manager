import { IamTagListItem } from '@/data/api/get-iam-tags';

export type SortTagsParams = {
  tags: IamTagListItem[];
  columnId: 'name' | 'count';
  desc: boolean;
};

export const sortTags = ({ tags, columnId, desc }: SortTagsParams) => {
  return tags.sort((tagA, tagB) => {
    if (typeof tagA[columnId] === 'string') {
      if (desc)
        return tagB[columnId]
          .toString()
          .localeCompare(tagA[columnId].toString());
      return tagA[columnId].toString().localeCompare(tagB[columnId].toString());
    }

    if (typeof tagA[columnId] === 'number') {
      if (desc) return Number(tagB[columnId]) - Number(tagA[columnId]);
      return Number(tagA[columnId]) - Number(tagB[columnId]);
    }

    return 0;
  });
};
