import { v6 } from "@ovh-ux/manager-core-api";
import { Suggestion } from '@/types/suggestion';

export const fetchCompanyNumbersSuggestions = async () => {
  const { data } = await v6.get<Suggestion[]>(
    '/me/suggest/companyIdentificationNumbers',
  );
  return data;
};
