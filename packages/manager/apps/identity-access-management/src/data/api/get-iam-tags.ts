export type IamTagRequest = {
  internalTags?: boolean;
  resourceType?: string;
  resourceURN?: string;
};

export type IamTagListItem = {
  name: string;
  count: number;
  isCustom: boolean;
};

export type IamTagGroupByKeysItem = {
  key: string;
  values: string[];
};

export type IamTagResponse = {
  list: IamTagListItem[];
  groupByKeys: IamTagGroupByKeysItem[];
};
