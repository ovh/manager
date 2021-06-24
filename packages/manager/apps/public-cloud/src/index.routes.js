import isEmpty from 'lodash/isEmpty';

import { DEFAULT_PROJECT_KEY } from './index.constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/?onboarding',
    redirectTo: 'app.redirect',
    resolve: {
      rootState: () => 'app',
    },
  });

  $stateProvider.state('app.redirect', {
    url: '?onboarding',
    resolve: {
      defaultProjectId: /* @ngInject */ (publicCloud) =>
        publicCloud.getDefaultProject(),
      unPaidProjects: /* @ngInject */ (publicCloud) =>
        publicCloud.getServices([
          {
            field: 'route.path',
            comparator: 'eq',
            reference: '/cloud/project/{serviceName}',
          },
          {
            field: 'billing.lifecycle.current.state',
            comparator: 'eq',
            reference: 'unpaid',
          },
        ]),
      suspendedProjects: /* @ngInject */ (publicCloud) =>
        publicCloud.getProjects([
          {
            field: 'status',
            comparator: 'like',
            reference: 'suspended',
          },
        ]),
      redirect: /* @ngInject */ (
        $state,
        $transition$,
        defaultProjectId,
        unPaidProjects,
        suspendedProjects,
      ) => {
        if (!isEmpty(suspendedProjects) || !isEmpty(unPaidProjects)) {
          return $state.go('pci.projects');
        }
        if (defaultProjectId) {
          return $state.go('pci.projects.project', {
            projectId: defaultProjectId,
          });
        }
        return $state.go(
          $transition$.params().onboarding
            ? 'pci.projects.onboarding'
            : 'pci.projects.new',
        );
      },
    },
  });

  $stateProvider.state('app.mfaEnrollment', {
    url: 'mfa-enrollment',
    component: 'mfaEnrollment',
    params: {
      forced: {
        dynamic: true,
      },
    },
    resolve: {
      from: /* @ngInject */ ($transition$) => $transition$.$from().name,
    },
    translations: { value: ['.'], format: 'json' },
  });

  $stateProvider.state('redirect-kube', {
    url: '/pci/projects/default/kubernetes/new',
    redirectTo: (trans) => {
      const ovhUserPref = trans.injector().get('ovhUserPref');
      const publicCloud = trans.injector().get('publicCloud');

      return publicCloud
        .getProjects([
          {
            field: 'status',
            comparator: 'in',
            reference: ['creating', 'ok'],
          },
        ])
        .then((projects) => {
          if (projects.length > 0) {
            return ovhUserPref
              .getValue(DEFAULT_PROJECT_KEY)
              .then(({ projectId }) => ({
                state: 'pci.projects.project.kubernetes.add',
                params: {
                  projectId,
                },
              }))
              .catch(({ status }) => {
                if (status === 404) {
                  // No project is defined as favorite
                  // Go on the first one :)
                  return {
                    state: 'pci.projects.project.kubernetes.add',
                    params: {
                      projectId: projects[0].project_id,
                    },
                  };
                }
                // [TODO] Go to error page
                return null;
              });
          }
          return { state: 'pci.projects.onboarding' };
        });
    },
  });

  $urlRouterProvider.otherwise('/');
};
