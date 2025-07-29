import { name as componentName } from './iam-policies.component';

const redirectTo = (transition) =>
  transition
    .injector()
    .getAsync('service')
    .then(({ isIamEnabled }) =>
      !isIamEnabled ? 'dbaas-logs.detail.roles' : false,
    );

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.iam-policies', {
    url: '/iam-policies?cursors',
    params: {
      ip: null,
      cursors: {
        array: false,
        dynamic: true,
        inherit: false,
        squash: true,
        type: 'cursors',
        value: null,
      },
    },
    redirectTo,
    views: {
      logsContent: componentName,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('logs_iam_policies'),
      goTo: /* @ngInject */ ($state) => ({ name, params }) =>
        $state.go(name, params),
    },
  });
};
