export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.training.jobs.dashboard.general-information',
    {
      url: '/general-information',
      views: {
        jobView: 'ovhManagerPciProjectJobGeneralInformation',
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        goToAttachData: /* @ngInject */ ($state, projectId) => () =>
          $state.go(
            'pci.projects.project.training.jobs.dashboard.attach-data',
            {
              projectId,
            },
          ),
      },
    },
  );
};
