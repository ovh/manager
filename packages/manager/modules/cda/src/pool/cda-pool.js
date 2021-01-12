import template from './cda-pool.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-pool', {
    url: '/pool',
    views: {
      cdaDetailsTab: {
        template,
        abstract: true,
      },
    },
    translations: {
      format: 'json',
      value: ['.'],
    },
  });
};
