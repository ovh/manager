import isDate from 'lodash.isdate';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';

export const dataType = (data: unknown) => {
  if (Number.isInteger(data)) return FilterTypeCategories.Numeric;
  if (isDate(data)) return FilterTypeCategories.Date;
  if (typeof data === 'string') return FilterTypeCategories.String;
  if (typeof data === 'boolean') return FilterTypeCategories.Boolean;
  return typeof data;
};
