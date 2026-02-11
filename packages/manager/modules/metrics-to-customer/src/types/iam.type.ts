export const IamTagsOperator = {
  EQ: 'EQ' as const,
  EXISTS: 'EXISTS' as const,
  ILIKE: 'ILIKE' as const,
  LIKE: 'LIKE' as const,
  NEQ: 'NEQ' as const,
  NEXISTS: 'NEXISTS' as const,
} as const;

export type IamTagsOperator = (typeof IamTagsOperator)[keyof typeof IamTagsOperator];

export type IamTagFilter = {
  operator?: IamTagsOperator | null;
  value: string;
};

export type IamTagsFilter = {
  [tagKey: string]: IamTagFilter[];
};

export type IamResourceTags = {
  [key: string]: string | undefined;
};

export type IamResource = {
  id: string;
  urn: string;
  name: string;
  displayName: string;
  type: string;
  owner: string;
  tags: IamResourceTags;
};

export type IamResourcesResponse = IamResource[];
