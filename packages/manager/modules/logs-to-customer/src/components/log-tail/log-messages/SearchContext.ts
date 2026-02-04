import { createContext } from 'react';

export interface ISearchContext {
  query?: string;
}

export const searchContext = createContext<ISearchContext>({
  query: undefined,
});
