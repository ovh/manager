import clone from 'lodash/clone';
import template from './emailpro-task.html';

const state = {
  url: '/task',
  template,
  controller: 'EmailProTabTasksCtrl',
  resolve: {
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('emailpro_task'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.task', clone(state));
  $stateProvider.state('mxplan.dashboard.task', clone(state));
};
