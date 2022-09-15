export const DEFAULT_FILTER_COLUMN = {
  activeDirectories: 'description',
};

export const ENUM_ACTIVE_DIRECTORY_STATUS = [
  'creating',
  'deleting',
  'delivered',
  'error',
  'toCreate',
  'toDelete',
  'toUpdate',
  'unknown',
  'updating',
];

export const SORT_ORDER = {
  '1': 'ASC',
  '-1': 'DESC',
};

export default {
  DEFAULT_FILTER_COLUMN,
  ENUM_ACTIVE_DIRECTORY_STATUS,
  SORT_ORDER,
};
