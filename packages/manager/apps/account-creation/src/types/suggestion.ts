import { Company } from './company';

export type CompanySuggestion = {
  entryList: Company[];
  provider: string;
  type: string;
  hasMore?: boolean;
};
