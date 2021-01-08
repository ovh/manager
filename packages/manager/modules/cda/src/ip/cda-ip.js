import template from './cda-ip.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.cda-details.cda-ip', {
    url: '/ip',
    views: {
      cdaDetailsTab: {
        template,
        abstract: true,
      },
    },
  });
};
