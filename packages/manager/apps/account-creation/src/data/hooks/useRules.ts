import { useQuery } from '@tanstack/react-query';
import { getRules } from '@/data/api/rules';
import { Country } from '@/types/country';
import { Language } from '@/types/language';

export const useRules = (country: Country | null, language: Language | null) =>
  useQuery({
    queryKey: [`rules`],
    queryFn: () => getRules({ country, language }),
  });
