import template from './dedicated-server-bandwidth-vrack-order.html';

angular.module('App').config(
  /* @ngInject */
  ($stateProvider) => {
    const parentStates = [
      'app.dedicated-server.server.dashboard',
      'app.dedicated-server.server.interfaces',
    ];

    parentStates.forEach((parent) => {
      $stateProvider.state(`${parent}.bandwidth-legacy-private-order`, {
        url: '/bandwidth-legacy-private-order',
        views: {
          modal: {
            controller: 'ServerOrderLegacyBandwidthVrackCtrl',
            controllerAs: 'ctrl',
            template,
          },
        },
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
      });
    });
  },
);
