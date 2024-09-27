import z from 'zod';
import { schemaAddCidr } from '@/schema/formSchema';

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
  description: string | null;
}

export interface TIPRestrictionsMethod {
  authorization: FilterRestrictionsServer[] | null;
}

export interface TIPRestrictionsDraft {
  draft: boolean;
  checked: boolean | null;
}

export type TIPRestrictionsDefault = TIPRestrictions & TIPRestrictionsMethod;

export type TIPRestrictionsData = TIPRestrictions &
  TIPRestrictionsDraft &
  TIPRestrictionsMethod;

export type ConfirmCIDRSchemaType = z.infer<ReturnType<typeof schemaAddCidr>>;
