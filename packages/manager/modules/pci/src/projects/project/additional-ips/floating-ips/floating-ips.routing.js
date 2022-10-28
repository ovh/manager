export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.floating-ips', {
    url: '/floating-ips?ip',
    views: {
      ipView: 'pciProjectAdditionalIpsFloatingIps',
    },
    params: {
      ip: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate
          .refresh()
          .then(() =>
            $translate.instant('pci_additional_ips_floating_ip_title'),
          ),
      additionalIp: /* @ngInject */ ($transition$) => $transition$.params().ip,
      floatingIps: /* @ngInject */ (additionalIps) => additionalIps.floatingIps,
      goToEditInstance: /* @ngInject */ ($state, projectId, trackClick) => (
        serviceName,
      ) => {
        trackClick('floating-ips::table-option-menu::edit');
        return $state.go(
          'pci.projects.project.additional-ips.floating-ips.edit',
          {
            projectId,
            serviceName,
          },
        );
      },
      goToTerminate: /* @ngInject */ ($state, projectId, trackClick) => (
        serviceName,
      ) => {
        trackClick('floating-ips::table-option-menu::terminate');
        return $state.go(
          'pci.projects.project.additional-ips.floating-ips.terminate',
          {
            projectId,
            serviceName,
          },
        );
      },
      goToInstance: /* @ngInject */ ($state, projectId) => (instanceId) =>
        $state.href('pci.projects.project.instances.instance', {
          projectId,
          instanceId,
        }),
    },
  });
};
