import { createContext } from 'react';

interface InternalMeta {
  has3AZ?: boolean;
}

export type RegionMetaType = InternalMeta | Record<string, unknown> | undefined;

export const RegionMetaContext = createContext<RegionMetaType>(undefined);
