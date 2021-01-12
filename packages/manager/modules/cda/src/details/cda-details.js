import controller from './cda-details.controller';
import template from './cda-details.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-details', {
    url: '',
    views: {
      cdaDetails: {
        template,
        controller,
        controllerAs: 'CdaDetailsCtrl',
      },
    },
  });
};
