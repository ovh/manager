export const FAQ_LINK = {
  CZ: 'https://www.ovh.cz/faq/',
  FI: 'https://www.ovh-hosting.fi/ukk/',
  LT: 'https://www.ovh.lt/duk/',
};

export const X_PAGINATION_MODE = 'X-Pagination-Mode';
export const CACHED_OBJECT_LIST_PAGES = 'CachedObjectList-Pages';

export const STEP_STATES = {
  OK: 'OK',
  PENDING: 'PENDING',
};

export const STEP_TYPES = {
  ORDERS: 'ORDERS',
  DEBT: 'DEBT',
  NIC: 'NIC',
  CONTRACTS: 'CONTRACTS',
};

export const MIGRATION_DATES = {
  FI: {
    START: '10/01/2020',
    END: '01/01/2021',
  },
  CZ: {
    START: '11/10/2020',
    END: '03/01/2021',
  },
  LT: {
    START: '10/21/2020',
    END: '02/01/2021',
  },
};

export const MIGRATION_STATUS = {
  CANCELED: 'CANCELED',
  CHECKED: 'CHECKED',
  DOING: 'DOING',
  MIGRATED: 'MIGRATED',
  TO_CHECK: 'TO_CHECK',
  TODO: 'TODO',
};

export default {
  CACHED_OBJECT_LIST_PAGES,
  FAQ_LINK,
  MIGRATION_DATES,
  MIGRATION_STATUS,
  STEP_STATES,
  STEP_TYPES,
  X_PAGINATION_MODE,
};
