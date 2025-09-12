import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

const getBooleanValue = (value: string) => {
  return value === 'true';
};

export const comparatorFn = (
  dataType: FilterTypeCategories,
  a: string,
  b: string,
  descendingOrder: boolean,
): number => {
  if (!a || !b) return -1;
  const firstOperand = descendingOrder ? b : a;
  const secondOperand = descendingOrder ? a : b;
  switch (dataType) {
    case FilterTypeCategories.Numeric:
      return parseFloat(firstOperand) - parseFloat(secondOperand);
    case FilterTypeCategories.Date:
      return (
        new Date(firstOperand).getTime() - new Date(secondOperand).getTime()
      );
    case FilterTypeCategories.Boolean:
      return (
        Number(getBooleanValue(firstOperand)) -
        Number(getBooleanValue(secondOperand))
      );
    case FilterTypeCategories.String:
      return firstOperand
        ?.trim()
        .toLowerCase()
        ?.localeCompare?.(secondOperand?.trim().toLowerCase());
    default:
      return -1;
  }
};
