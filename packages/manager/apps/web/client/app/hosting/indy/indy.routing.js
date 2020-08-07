import template from './INDY.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.indy', {
    url: '/indy',
    controller: 'HostingIndyTabCtrl',
    template,
  });
};
