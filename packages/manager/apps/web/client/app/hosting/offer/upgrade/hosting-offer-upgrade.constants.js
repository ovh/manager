export const DETACH_DEFAULT_OPTIONS = {
  type: 'detach',
  durationCode: 'P12M',
  durationText: '12m',
  pricingMode: 'default',
  quantity: 1,
};

export const OFFERS_WITHOUT_FREEDOM = [
  'HOSTING_STARTER',
  'HOSTING_STARTER_OVH',
  'HOSTING_PERSO',
  'HOSTING_PERFORMANCE_1',
  'HOSTING_PERFORMANCE_2',
  'HOSTING_PERFORMANCE_3',
  'HOSTING_PERFORMANCE_4',
  'START_10_M',
  'HOSTING_FREE_100_M',
  'KIMSUFI_2015',
  'PERF_2014_X_1',
  'PERF_2014_X_2',
  'PERF_2014_X_3',
  'PERF_2014_X_4',
  'PERSO_2014',
  'PRO_2014',
  'PERSO_2010',
  'PRO_2010',
  'CLOUDWEB_1',
  'CLOUDWEB_2',
  'CLOUDWEB_3',
  'ITPERSO_2012',
  'ITBUSINESS_2012',
  'ITPREMIUM_2012',
  'START_1_G',
  'START_5_G',
  'START_10_G',
  '20_GP',
  '60_GP',
  '300_GP',
  'HOSTING_PRO',
  '90_PLAN',
];

export const OFFER_UPGRADE_BLOCKING_CONDITIONS = {
  CLOUDDB_PERFORMANCE_TO_PRO: 'clouddb_performance_to_pro',
  DATABASES_PRO_TO_PERSO: 'databases_pro_to_perso',
  FTP_USERS_PRO_TO_PERSO: 'ftp_users_pro_to_perso',
  PERFORMANCE_DOWNGRADE_TOO_LOW: 'performance_downgrade_too_low',
  MAILING_LISTS_TO_PERSO: 'mailing_lists_to_perso',
};

export const OFFER_CATEGORY = {
  PERFORMANCE: 'PERFORMANCE',
  PRO: 'PRO',
  PERSO: 'PERSO',
};

export const PERFORMANCE_LEVEL_MAP = {
  'hosting-performance-1': 1,
  'hosting-performance-2': 2,
  'hosting-performance-3': 3,
  'hosting-performance-4': 4,
  hosting_performance_1: 1,
  hosting_performance_2: 2,
  hosting_performance_3: 3,
  hosting_performance_4: 4,
  PERF_2014_X_1: 1,
  PERF_2014_X_2: 2,
  PERF_2014_X_3: 3,
  PERF_2014_X_4: 4,
};

export default {
  DETACH_DEFAULT_OPTIONS,
  OFFERS_WITHOUT_FREEDOM,
  OFFER_UPGRADE_BLOCKING_CONDITIONS,
  OFFER_CATEGORY,
  PERFORMANCE_LEVEL_MAP,
};
