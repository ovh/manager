import { useRules } from '@/data/hooks/useRules';
import { Country } from '@/types/country';

export const useLegalFormRules = (
  ovhSubsidiary?: string,
  country?: Country,
) => {
  const { data: rules } = useRules({
    ovhSubsidiary: ovhSubsidiary || null,
    country: country || null,
    language: null,
  });

  const legalFormRules = rules ? rules.legalform : undefined;

  if (legalFormRules) {
    legalFormRules.in = legalFormRules.in.filter((value) => value !== 'other');
  }

  return legalFormRules;
};
