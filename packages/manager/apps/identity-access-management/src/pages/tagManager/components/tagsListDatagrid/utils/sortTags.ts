import { IamTagListItem } from '@/data/api/get-iam-tags';

export type SortTagsParams = {
  tags: IamTagListItem[];
  columnId: 'name' | 'count';
  desc: boolean;
};

export const sortString = (stringA: unknown, stringB: unknown) => {
  return stringA.toString().localeCompare(stringB.toString());
};

export const sortNumber = (numberA: unknown, numberB: unknown) => {
  return Number(numberA) - Number(numberB);
};

export const sortTags = ({ tags, columnId, desc }: SortTagsParams) => {
  return tags.sort((tagA, tagB) => {
    if (typeof tagA[columnId] === 'string') {
      if (desc) return sortString(tagB[columnId], tagA[columnId]);
      return sortString(tagA[columnId], tagB[columnId]);
    }

    if (typeof tagA[columnId] === 'number') {
      if (desc) return sortNumber(tagB[columnId], tagA[columnId]);
      return sortNumber(tagA[columnId], tagB[columnId]);
    }

    return 0;
  });
};
