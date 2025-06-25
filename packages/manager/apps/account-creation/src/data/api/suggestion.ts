import { v6 } from '@ovh-ux/manager-core-api';
import { Country } from '@ovh-ux/manager-config';
import { CompanySuggestion } from '@/types/suggestion';

export const getCompanySuggestion = async (
  country: Country,
  identifier: string,
) => {
  const { data } = await v6.get<CompanySuggestion>(`/me/suggest/company`, {
    params: {
      country,
      identifier,
    },
  });

  return data;
};
