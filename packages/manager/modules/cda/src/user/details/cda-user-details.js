import controller from './cda-user-details.controller';
import template from './cda-user-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.cda-details.cda-user.cda-user-details', {
    url: '/{userName}/details',
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
