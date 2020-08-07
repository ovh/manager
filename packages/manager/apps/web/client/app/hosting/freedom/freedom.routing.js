import template from './FREEDOM.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.freedom', {
    url: '/freedom',
    controller: 'HostingFreedomTabCtrl',
    template,
  });
};
