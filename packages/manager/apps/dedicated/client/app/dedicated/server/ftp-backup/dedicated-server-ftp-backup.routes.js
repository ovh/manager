import template from './dedicated-server-ftp-backup.html';

angular.module('App').config(
  /* @ngInject */ ($stateProvider, coreConfigProvider) => {
    if (coreConfigProvider.region !== 'US') {
      $stateProvider.state('app.dedicated.server.ftpBackup', {
        url: '/backup',
        views: {
          'tabView@app.dedicated.server': {
            template,
          },
        },
        translations: { value: ['..'], format: 'json' },
      });
    }
  },
);
