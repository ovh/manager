export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.etl.home', {
    url: '/home',
    views: {
      etlTabUiView: 'pciProjectEtlHome',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null, // Hide breadcrumb
    },
  });
};
