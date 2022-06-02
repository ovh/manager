export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.order', {
    url: '/order',
    component: 'pciProjectAdditionalIpsOrder',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goBack: /* @ngInject */ (goToAdditionalIps) => goToAdditionalIps,
    },
  });
};
