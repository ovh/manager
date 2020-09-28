import template from './dedicated-server-usb-storage.html';

angular
  .module('App')
  .config(
  /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app.dedicated-server.server.usbStorage', {
      url: '/usb-storage',
      views: {
          'tabView@app.dedicated-server.server': {
          template,
        },
      },
      translations: { value: ['..'], format: 'json' },
    });
  },
);
