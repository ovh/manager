export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.training.jobs.dashboard.attach-data',
    {
      url: '/attach-data',
      views: {
        jobView: 'ovhManagerPciProjectJobAttachData',
      },
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
      },
    },
  );
};
