angular.module('managerApp')
  .constant('additionalDisk.capacities', [
    {
      option: 'additionalDisk50',
      size: 50,
    },
    {
      option: 'additionalDisk100',
      size: 100,
    },
    {
      option: 'additionalDisk200',
      size: 200,
    },
    {
      option: 'additionalDisk500',
      size: 500,
    },
  ])
  .constant('additionalDisk.hasNoOption', 'Does not have option')
  .constant('STOP_NOTIFICATION_USER_PREF', {
    autoRenew: 'VPS_AUTORENEW_STOP_BOTHER',
    ipV6: 'VPS_IPV6_STOP_NOTIFICATION',
  });
