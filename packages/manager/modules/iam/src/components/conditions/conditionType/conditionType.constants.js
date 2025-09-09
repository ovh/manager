import { CRITERIA } from '../operator/operator.constants';

export const CONDITION_TYPES = {
  TAG: 'tag',
  NAME: 'name',
  IP: 'ip',
};

export const CONDITION_TYPE_CRITERIA = {
  [CONDITION_TYPES.TAG]: [
    CRITERIA.EQ,
    CRITERIA.STARTS_WITH,
    CRITERIA.ENDS_WITH,
  ],
  [CONDITION_TYPES.NAME]: [
    CRITERIA.EQ,
    CRITERIA.STARTS_WITH,
    CRITERIA.ENDS_WITH,
    CRITERIA.IN,
  ],
  [CONDITION_TYPES.IP]: [CRITERIA.EQ, CRITERIA.IN_RANGE],
};
