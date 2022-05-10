export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.failover-ips.order', {
    url: '/order',
    component: 'pciProjectFailoverIpsOrder',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      goBack: /* @ngInject */ (goToFailoverIps) => goToFailoverIps,
    },
  });
};
