import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosError } from 'axios';
import { Country } from '@ovh-ux/manager-config';
import {
  CompanySuggestion,
  CompanySuggestionError,
  GermanRegisterCourtList,
} from '@/types/suggestion';

export type GetCompanySuggestionError = AxiosError<CompanySuggestionError>;

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

/** The German register courts and register types: one call, no paging. */
export const getGermanRegistersByCourt = async () => {
  const { data } = await v6.get<GermanRegisterCourtList>(
    '/me/suggest/germanRegistersByCourt',
  );
  return data;
};
