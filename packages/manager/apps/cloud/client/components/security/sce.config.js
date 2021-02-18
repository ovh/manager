angular.module('managerApp').config(($sceDelegateProvider) => {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://compute.*.cloud.ovh.net:6080/**', // VNC PUBLIC CLOUD
  ]);
});
