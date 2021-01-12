import template from './cda-details-home.html';
import controller from './cda-details-home.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-details.cda-details-home', {
    url: '/home',
    views: {
      cdaDetailsTab: {
        template,
        controller,
        controllerAs: 'CdaDetailsHomeCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
};
