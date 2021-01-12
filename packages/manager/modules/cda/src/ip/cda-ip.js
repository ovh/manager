import template from './cda-ip.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-details.cda-ip', {
    url: '/ip',
    views: {
      cdaDetailsTab: {
        template,
        abstract: true,
      },
    },
  });
};
