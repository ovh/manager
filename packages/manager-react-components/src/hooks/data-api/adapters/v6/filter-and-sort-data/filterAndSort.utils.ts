import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

const getBooleanValue = (value: string) => {
  return value === 'true';
};

export const compare = (
  dataType: FilterTypeCategories,
  dataA: string,
  dataB: string,
  descendingOrder: boolean,
): number => {
  if (!dataA || !dataB) return -1;
  const firstOperand = descendingOrder ? dataB : dataA;
  const secondOperand = descendingOrder ? dataA : dataB;
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
