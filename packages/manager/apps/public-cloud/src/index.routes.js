import { DEFAULT_PROJECT_KEY } from './index.constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/?onboarding',
    redirectTo: (trans) =>
      trans
        .injector()
        .get('publicCloud')
        .getDefaultProject()
        .then((projectId) =>
          projectId
            ? {
                state: 'pci.projects.project',
                params: {
                  projectId,
                },
              }
            : {
                state: trans.params().onboarding
                  ? 'pci.projects.onboarding'
                  : 'pci.projects.new',
              },
        ),
    resolve: {
      rootState: () => 'app',
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

  $stateProvider.state('app.userContracts', {
    url: 'user-contracts',
    redirectTo: ($transition$) => {
      const { contracts } = $transition$.params();
      return contracts ? '' : 'app';
    },
    component: 'userContracts',
    params: {
      contracts: null,
    },
    translations: { value: ['.'], format: 'json' },
    resolve: {
      contracts: /* @ngInject */ ($transition$) =>
        $transition$.params().contracts,
    },
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
