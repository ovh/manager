import template from './dedicated-server-bandwidth-order.html';

angular.module('App').config(
  /* @ngInject */
  ($stateProvider) => {
    const parentStates = [
      'app.dedicated-server.server.dashboard',
      'app.dedicated-server.server.interfaces',
    ];

    parentStates.forEach((parent) => {
      $stateProvider.state(`${parent}.bandwidth-legacy-public-order`, {
        url: '/bandwidth-legacy-public-order',
        views: {
          modal: {
            controller: 'ServerOrderLegacyBandwidthCtrl',
            template,
          },
        },
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
      });
    });
  },
);
