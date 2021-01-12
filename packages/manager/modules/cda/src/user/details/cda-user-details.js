import controller from './cda-user-details.controller';
import template from './cda-user-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-user.cda-user-details', {
    url: '/:userName',
    views: {
      cdaUserContent: {
        template,
        controller,
        controllerAs: 'CdaUserDetailsCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
};
