import moment from 'moment';

export const UCENTS_FACTOR = 1000000000;

export const NEW_OFFERS_START_DATE = moment('2023-06-15');

export const NEW_OFFERS_END_DATE = moment(NEW_OFFERS_START_DATE).add(6, 'M');

export const NEW_OFFERS_MIGRATION_MAP = {
  PERSO: {
    downgrade: [],
    equal: ['PERSO'],
    upgrade: [
      'PRO',
      'PERFORMANCE_1',
      'PERFORMANCE_2',
      'PERFORMANCE_3',
      'PERFORMANCE_4',
    ],
  },
  PRO: {
    downgrade: ['PERSO'],
    equal: ['PRO'],
    upgrade: [
      'PERFORMANCE_1',
      'PERFORMANCE_2',
      'PERFORMANCE_3',
      'PERFORMANCE_4',
    ],
  },
  PERF1: {
    downgrade: ['PRO'],
    equal: ['PERFORMANCE_1'],
    upgrade: ['PERFORMANCE_2', 'PERFORMANCE_3', 'PERFORMANCE_4'],
  },
  PERF2: {
    downgrade: ['PERFORMANCE_1'],
    equal: ['PERFORMANCE_2'],
    upgrade: ['PERFORMANCE_3', 'PERFORMANCE_4'],
  },
  PERF3: {
    downgrade: ['PERFORMANCE_1', 'PERFORMANCE_2'],
    equal: ['PERFORMANCE_3'],
    upgrade: ['PERFORMANCE_4'],
  },
  PERF4: {
    downgrade: ['PERFORMANCE_1', 'PERFORMANCE_2', 'PERFORMANCE_3'],
    equal: ['PERFORMANCE_4'],
    upgrade: [],
  },
};

export const CATEGORIES_MAP = {
  perso2014: 'PERSO',
  perso: 'PERSO',
  pro: 'PRO',
  pro2014: 'PRO',
  PERFORMANCE_1: 'PERFORMANCE',
  PERFORMANCE_2: 'PERFORMANCE',
  PERFORMANCE_3: 'PERFORMANCE',
  PERFORMANCE_4: 'PERFORMANCE',
};

export const CURRENT_OFFERS = {
  START: { downgrade: [], equal: [], upgrade: ['PERSO'] },
  KIMSUFI_2015: {
    downgrade: [],
    equal: [],
    upgrade: [
      'PERSO',
      'PRO',
      'PERFORMANCE_1',
      'PERFORMANCE_2',
      'PERFORMANCE_3',
      'PERFORMANCE_4',
    ],
  },
  PERSO_2010: NEW_OFFERS_MIGRATION_MAP.PERSO,
  PERSO_2014: NEW_OFFERS_MIGRATION_MAP.PERSO,
  PRO_2010: NEW_OFFERS_MIGRATION_MAP.PRO,
  PRO_2014: NEW_OFFERS_MIGRATION_MAP.PRO,
  PERF_2014_X_1: NEW_OFFERS_MIGRATION_MAP.PERF1,
  PERF_2014_X_2: NEW_OFFERS_MIGRATION_MAP.PERF2,
  PERF_2014_X_3: NEW_OFFERS_MIGRATION_MAP.PERF3,
  PERF_2014_X_4: NEW_OFFERS_MIGRATION_MAP.PERF4,
};

export const BADGES = {
  NEW: 'new',
  EQUAL: 'equal',
  UPGRADE: 'upgrade',
  DOWNGRADE: 'downgrade',
};

/* TODO ::
  1 - legacyPlanCode key could be removed once new catalog is prod
  2 - use planCode key directly with related object
*/
export const NEW_OFFERS_PLAN_CODES = {
  PERSO: {
    legacyPlanCode: 'perso2014',
    planCode: 'hosting-perso',
  },
  PRO: { legacyPlanCode: 'pro2014', planCode: 'hosting-pro' },
  PERFORMANCE_1: {
    legacyPlanCode: 'perf2014x1',
    planCode: 'hosting-performance-1',
  },
  PERFORMANCE_2: {
    legacyPlanCode: 'perf2014x2',
    planCode: 'hosting-performance-2',
  },
  PERFORMANCE_3: {
    legacyPlanCode: 'perf2014x3',
    planCode: 'hosting-performance-3',
  },
  PERFORMANCE_4: {
    legacyPlanCode: 'perf2014x4',
    planCode: 'hosting-performance-4',
  },
};

export default {
  UCENTS_FACTOR,
  NEW_OFFERS_START_DATE,
  NEW_OFFERS_END_DATE,
  CURRENT_OFFERS,
  BADGES,
  NEW_OFFERS_PLAN_CODES,
  CATEGORIES_MAP,
};
