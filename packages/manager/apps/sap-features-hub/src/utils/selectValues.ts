export const getSelectDefaultValue = <T extends string | number>(
  value: T,
  options: T[] | undefined,
): string | undefined => (options?.includes(value) ? `${value}` : undefined);

export const getDefaultValueWithAutoSelect = <T extends string | number>(
  value: T,
  options: T[] | undefined,
): string | undefined => {
  const defaultValue = getSelectDefaultValue(value, options);

  if (!defaultValue && options?.length === 1) {
    return options[0].toString();
  }
  return defaultValue;
};

export const getSelectLatestValue = <T extends string | number>({
  isPrefilled,
  value,
  prefilledValue,
}: {
  isPrefilled: boolean;
  prefilledValue: T;
  value: T;
}): T => {
  if (isPrefilled) {
    const hasChangedValue = !!value && value !== prefilledValue;
    return hasChangedValue ? value : prefilledValue;
  }
  return value;
};
