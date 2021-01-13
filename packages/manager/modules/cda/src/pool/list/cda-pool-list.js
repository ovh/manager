import controller from './cda-pool-list.controller';
import template from './cda-pool-list.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.cda-details.cda-pool.cda-pool-list', {
    url: '/list',
    views: {
      cdaPoolContent: {
        template,
        controller,
        controllerAs: 'CdaPoolListCtrl',
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
};
