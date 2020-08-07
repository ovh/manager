import template from './DUMPS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database.dump', {
    url: '/dump',
    template,
    controller: 'DatabaseDumpsCtrl',
  });
};
