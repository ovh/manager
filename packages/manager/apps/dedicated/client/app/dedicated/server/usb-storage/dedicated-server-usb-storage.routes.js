import template from './dedicated-server-usb-storage.html';

angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicated.server.usbStorage', {
      url: '/usb-storage',
      views: {
        'tabView@app.dedicated.server': {
          template,
        },
      },
      translations: { value: ['..'], format: 'json' },
    });
  },
);
