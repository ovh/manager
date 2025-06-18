import { Country, UserLocales } from '@ovh-ux/manager-config';
import { useQuery } from '@tanstack/react-query';
import { getRules } from '@/data/api/rules';

export const useRules = (
  country: Country | null,
  language: UserLocales | null,
) =>
  useQuery({
    queryKey: [`newAccount/rules`],
    queryFn: () => getRules({ country, language }),
  });
