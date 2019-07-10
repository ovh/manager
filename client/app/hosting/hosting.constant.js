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
  });
