import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.additional-ips.edit', {
    url: '/:serviceName/edit',
    views: {
      modal: {
        component: 'pciProjectAdditionalIpsEdit',
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
      ip: /* @ngInject */ (serviceName, additionalIps) =>
        find(additionalIps, {
          id: serviceName,
        }),
    },
  });
};
