const DEFAULT_PROJECT_KEY = 'PUBLIC_CLOUD_DEFAULT_PROJECT';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('app', {
      url: '/',
      resolve: {
        redirectTo: /* @ngInject */ ($q, ovhUserPref, publicCloud) => publicCloud
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
                  stateParams: {
                    projectId,
                  },
                }))
                .catch(({ status }) => {
                  if (status === 404) {
                    // No project is defined as favorite
                    // Go on the first one :)
                    return {
                      state: 'pci.projects.project',
                      stateParams: {
                        projectId: projects[0].project_id,
                      },
                    };
                  }
                  // [TODO] Go to error page
                  return null;
                });
            }
            return $q.when({ state: 'pci.projects.new' });
          })),
      },
    });

  $urlRouterProvider.otherwise('/');
};
