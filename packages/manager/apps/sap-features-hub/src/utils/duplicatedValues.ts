export const hasDuplicatedValues = (values: (string | number)[]) => {
  const filledValues = values?.filter((v) => !!v);

  if (filledValues.length < 2) return false;
  const uniqueValues = [...new Set(filledValues)];

  return values.length !== uniqueValues.length;
};
