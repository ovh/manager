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
        onCancelClick: /* @ngInject */ (goBack, trackClick) => () => {
          trackClick('failover-ips::terminate::cancel');
          return goBack();
        },
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        terminateIp: /* @ngInject */ (
          PciProjectAdditionalIpService,
          ip,
          trackClick,
        ) => () => {
          trackClick('failover-ips::terminate::confirm');
          return PciProjectAdditionalIpService.deleteIpBlock(ip);
        },
      },
    },
  );
};
