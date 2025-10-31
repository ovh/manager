export const ValidityPeriodErrors = {
  minPeriod: 'MIN_PERIOD',
  maxPeriod: 'MAX_PERIOD',
} as const;

export type ValidityPeriodErrorsType = typeof ValidityPeriodErrors[keyof typeof ValidityPeriodErrors];

const ValidityMaxPeriod = 365;
const ValidityMinPeriod = 1;

export const validateValidityDate = (validity: number) => {
  if (validity < ValidityMinPeriod) return ValidityPeriodErrors.minPeriod;
  if (validity > ValidityMaxPeriod) return ValidityPeriodErrors.maxPeriod;
  return undefined;
};
