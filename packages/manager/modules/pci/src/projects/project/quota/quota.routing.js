import { RX_PLAN_CODE_PATTERN } from './quota.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quota', {
    url: '/quota',
    component: 'pciProjectQuota',
    resolve: {
      region: /* @ngInject */ (coreConfig) => coreConfig.getRegion(),

      hasDefaultPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
        ovhPaymentMethod.hasDefaultPaymentMethod(),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_quota'),
      serviceOptions: /* @ngInject */ ($http, projectId) => {
        return $http
          .get(`/order/cartServiceOption/cloud/${projectId}`)
          .then(({ data }) => {
            return data
              .filter((option) => option.family === 'quota')
              .sort((a, b) => {
                return (
                  parseInt(RX_PLAN_CODE_PATTERN.exec(a.planCode)[1], 10) -
                  parseInt(RX_PLAN_CODE_PATTERN.exec(b.planCode)[1], 10)
                );
              });
          });
      },
    },
  });
};
