import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.failover-ips.edit', {
    url: '/:serviceName/edit',
    views: {
      modal: {
        component: 'pciProjectFailoverIpsEdit',
      },
    },
    layout: 'modal',
    translations: {
      format: 'json',
      value: ['.'],
    },
    resolve: {
      breadcrumb: () => null,
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      ip: /* @ngInject */ (serviceName, failoverIps) =>
        find(failoverIps, {
          id: serviceName,
        }),
    },
  });
};
