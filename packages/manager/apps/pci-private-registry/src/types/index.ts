export type FilterRestrictionsServer = 'management' | 'registry';

export enum FilterRestrictionsEnum {
  MANAGEMENT = 'management',
  REGISTRY = 'registry',
}

export enum TIPRestrictionsMethodEnum {
  DELETE = 'DELETE',
  REPLACE = 'REPLACE',
  ADD = 'ADD',
}

export interface TIPRestrictions {
  createdAt: Date;
  ipBlock: string;
  description: string;
}

export interface TIPRestrictionsMethod {
  authorization: FilterRestrictionsServer[];
}

export interface TIPRestrictionsDraft {
  draft: boolean;
  checked: boolean;
}

export type TIPRestrictionsDefault = TIPRestrictions & TIPRestrictionsMethod;

export type TIPRestrictionsData = TIPRestrictions &
  TIPRestrictionsDraft &
  TIPRestrictionsMethod;
