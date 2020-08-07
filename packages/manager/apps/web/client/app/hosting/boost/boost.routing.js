import template from './BOOST.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.boost', {
    url: '/boost',
    template,
    controller: 'HostingBoostTabCtrl',
  });
};
