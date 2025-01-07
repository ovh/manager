import { createContext } from 'react';

interface InternalMeta {
  has3AZ?: boolean;
}

export type MetaType = InternalMeta | Record<string, unknown> | undefined;

export const MetaContext = createContext<MetaType>(undefined);
