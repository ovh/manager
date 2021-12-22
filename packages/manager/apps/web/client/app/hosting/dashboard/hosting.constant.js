angular
  .module('App')
  .constant('HOSTING', {
    cloudWeb: {
      configurationQuota: {
        unit: 'GB',
        value: 15,
      },
    },
    offers: {
      START_10_M: 'START_10_M',
    },
  })
  .constant('HOSTING_OPERATION_STATUS', {
    TODO: 'todo',
    DOING: 'doing',
    DONE: 'done',
    ERROR: 'error',
    CANCELLED: 'cancelled',
  })
  .constant('HOSTING_RUNTIME', {
    NODE: 'nodejs',
    PHP: 'phpfpm',
  })
  .constant('HOSTING_STATUS', {
    CREATED: 'created',
    CREATING: 'creating',
    DELETING: 'deleting',
    REGENERATING: 'regenerating',
    UPDATING: 'updating',
  })
  .constant('HOSTING_UPGRADES', [
    'CLOUDWEB_1',
    'CLOUDWEB_2',
    'CLOUDWEB_3',
    'KS',
    'PERFORMANCE_1',
    'PERFORMANCE_2',
    'PERFORMANCE_3',
    'PERFORMANCE_4',
    'PERSO',
    'PRO',
    'START',
  ])
  .constant('HOSTING_FLUSH_STATE', {
    OK: 'ok',
    CHECK: 'check',
    DOING: 'doing',
  });
