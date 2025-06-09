import { useQuery } from '@tanstack/react-query';
import { getRules, RulesParam } from '@/data/api/rules';

/**
 * Query key generation in the format of ['key1=value1', 'key2=value2'] since some
 * parameters contain the same value (e.g. country and phoneCountry)
 * @param params parameters to query from the API
 * @returns String array in the form of ['country=GB', 'language=en_GB']
 */
const generateQueryKey = (params: RulesParam) =>
  Object.entries(params).map(([key, value]) => `${key}=${value}`);

export const useRules = (params: RulesParam) =>
  useQuery({
    queryKey: ['/newAccount/rules', ...generateQueryKey(params)],
    queryFn: () => getRules(params),
  });

export const useLegalFormRules = (params: RulesParam) =>
  useQuery({
    queryKey: ['/newAccount/rules', ...generateQueryKey(params)],
    queryFn: () => getRules(params),
    select: (rules) => {
      if (!rules.legalform) return undefined;

      return {
        ...rules.legalform,
        in: rules.legalform.in.filter((value) => value !== 'other'),
      };
    },
  });
