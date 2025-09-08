import { CRITERIA } from '../operator/operator.constants';

export const CONDITION_TYPES = {
  TAG: 'tag',
};

export const CONDITION_TYPE_CRITERIA = {
  [CONDITION_TYPES.TAG]: [
    CRITERIA.EQ,
    CRITERIA.STARTS_WITH,
    CRITERIA.ENDS_WITH,
  ],
};
