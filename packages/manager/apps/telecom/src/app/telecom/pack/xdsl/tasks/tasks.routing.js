import controller from './tasks.controller';
import template from './tasks.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.tasks', {
    url: '/tasks',
    views: {
      'xdslView@telecom.packs.pack.xdsl.line': {
        template,
        controller,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('xdsl_tasks_list'),
    },
  });
};
