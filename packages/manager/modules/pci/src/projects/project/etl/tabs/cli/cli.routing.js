export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.etl.cli', {
    url: '/cli',
    views: {
      etlTabUiView: 'pciProjectEtlCli',
    },
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb,
    },
  });
};
