export const getSelectDefaultValue = <T extends string | number>(
  value: T,
  options: T[] | undefined,
): string | undefined => (options?.includes(value) ? `${value}` : undefined);

export const getSelectLatestValue = ({
  isPrefilled,
  value,
  prefilledValue,
}: {
  isPrefilled: boolean;
  prefilledValue: string;
  value: string;
}): string => {
  if (isPrefilled) {
    const hasChangedValue = !!value && value !== prefilledValue;
    return hasChangedValue ? value : prefilledValue;
  }
  return value;
};
