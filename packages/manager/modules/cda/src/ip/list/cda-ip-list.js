import controller from './cda-ip-list.controller';
import template from './cda-ip-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-ip.cda-ip-list', {
    url: '/list',
    views: {
      cdaIpContent: {
        template,
        controller,
        controllerAs: 'CdaIpListCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
};
