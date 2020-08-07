import controller from './hosting-user-logs.controller';
import template from './USER_LOGS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.user-logs', {
    url: '/user-logs',
    template,
    controller,
    controllerAs: 'ctrl',
  });
};
