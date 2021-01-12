import controller from './cda-user-list.controller';
import template from './cda-user-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-details.cda-user.cda-user-list', {
    url: '/list',
    views: {
      cdaUserContent: {
        template,
        controller,
        controllerAs: 'CdaUserListCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
};
