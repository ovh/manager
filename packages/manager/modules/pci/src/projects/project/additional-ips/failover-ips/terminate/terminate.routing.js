export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.additional-ips.failover-ips.terminate',
    {
      url: '/:serviceName/terminate',
      views: {
        modal: {
          component: 'pciAdditionalIpsTerminate',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        ip: /* @ngInject */ (serviceName, failoverIps) =>
          failoverIps.find(({ id }) => id === serviceName)?.ip,
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        terminateIp: /* @ngInject */ (
          PciProjectAdditionalIpService,
          ip,
        ) => () => PciProjectAdditionalIpService.deleteIpBlock(ip),
      },
    },
  );
};
