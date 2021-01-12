import template from './cda-user.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cda.dashboard.cda-user', {
    url: '/user',
    views: {
      cdaDetailsTab: {
        template,
        abstract: true,
      },
    },
  });
};
