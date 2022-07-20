export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.additional-ips.floating-ips.edit',
    {
      url: '/:serviceName/edit',
      views: {
        modal: {
          component: 'pciAdditionalIpsFloatingIpEdit',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: /* @ngInject */ () => null,
        goBack: /* @ngInject */ ($state) => () => $state.go('^'),
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        ip: /* @ngInject */ (serviceName, floatingIps) =>
          floatingIps.find(({ id }) => id === serviceName),
      },
    },
  );
};
