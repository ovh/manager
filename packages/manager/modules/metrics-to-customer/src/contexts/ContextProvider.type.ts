import { ReactNode } from 'react';

export interface ContextProviderProps<T> {
  children: ReactNode;
  context: T;
}
