import { DEFAULT_PROJECT_KEY } from './index.constants';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('app', {
      url: '/',
      redirectTo: trans => trans.injector().get('publicCloud')
        .handleDefaultProject(),
    });

  $stateProvider
    .state('redirect-kube', {
      url: '/pci/projects/default/kubernetes',
      redirectTo: (trans) => {
        const ovhUserPref = trans.injector().get('ovhUserPref');
        const publicCloud = trans.injector().get('publicCloud');

        return publicCloud
          .getProjects([{
            field: 'status',
            comparator: 'in',
            reference: ['creating', 'ok'],
          }])
          .then(((projects) => {
            if (projects.length > 0) {
              return ovhUserPref
                .getValue(DEFAULT_PROJECT_KEY)
                .then(({ projectId }) => ({
                  state: 'pci.projects.project',
                  params: {
                    projectId,
                  },
                }))
                .catch(({ status }) => {
                  if (status === 404) {
                    // No project is defined as favorite
                    // Go on the first one :)
                    return {
                      state: 'pci.projects.project',
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
          }));
      },
    });

  $urlRouterProvider.otherwise('/');
};
