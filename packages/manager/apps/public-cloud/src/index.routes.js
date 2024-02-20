import { DEFAULT_PROJECT_KEY } from './index.constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    url: '/',
    redirectTo: 'app.redirect',
    resolve: {
      rootState: () => 'app',
    },
  });

  /**
   * Using redirectTo and using future states, this triggers the lazy loading mechanism which will,
   * once the state is loaded, execute a retry on the transition (https://github.com/ui-router/core/blob/master/src/hooks/lazyLoad.ts#L32-L67 )
   *
   * If we have some API calls in the redirectTo, calls are repeated.
   * We can't use resolvables on the state that use redirectTo because resolves are executed once the state is entered, which is not the case.
   *
   * So this is a sort of hack : create an isolated state (without children), and in his resolves we use $state.go.
   * This state shouldn't have sub states or you should override `redirect` resolve.
   */
  $stateProvider.state('app.redirect', {
    url: '?onboarding',
    resolve: {
      redirect: /* @ngInject */ ($state) =>
        $state.go('pci.projects.onboarding'),
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
