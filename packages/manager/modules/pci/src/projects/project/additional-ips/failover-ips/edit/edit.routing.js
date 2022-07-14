export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.additional-ips.failover-ips.edit',
    {
      url: '/:serviceName/edit',
      views: {
        modal: {
          component: 'pciAdditionalIpsFailoverIpEdit',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        onCancelClick: /* @ngInject */ (trackClick, goBack) => () => {
          trackClick('failover-ips::edit::cancel');
          return goBack();
        },
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        ip: /* @ngInject */ (serviceName, failoverIps) =>
          failoverIps.find(({ id }) => id === serviceName),
        instances: /* @ngInject */ (
          PciProjectsProjectInstanceService,
          projectId,
        ) => PciProjectsProjectInstanceService.getAllInstanceDetails(projectId),
      },
    },
  );
};
