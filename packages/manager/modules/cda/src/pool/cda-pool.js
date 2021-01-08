import template from './cda-pool.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.cda-details.cda-pool', {
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
