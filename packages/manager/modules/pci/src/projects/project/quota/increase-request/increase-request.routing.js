import { ISSUE_CATEGORY, ISSUE_SERVICE_TYPE } from './increase.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quota.increase', {
    url: '/increase',
    views: {
      modal: {
        component: 'pciProjectQuotaIncrease',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      issueTypes: /* @ngInject */ (OvhApiSupport, $translate) =>
        OvhApiSupport.v6().getIssueTypes({
          category: ISSUE_CATEGORY,
          language: $translate.use(),
          serviceType: ISSUE_SERVICE_TYPE,
        }).$promise,
      serviceOptions: /* @ngInject */ ($http, projectId) => {
        const rxPlanCode = /quota-([0-9]+)vms/;
        return $http
          .get(`/order/cartServiceOption/cloud/${projectId}`)
          .then(({ data }) => {
            return data
              .filter((option) => option.family === 'quota')
              .sort((a, b) => {
                return (
                  parseInt(rxPlanCode.exec(a.planCode)[1], 10) -
                  parseInt(rxPlanCode.exec(b.planCode)[1], 10)
                );
              });
          });
      },
      goBack: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('^');

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              {
                textHtml: message,
              },
              'pci.projects.project.quota',
            ),
          );
        }

        return promise;
      },
    },
  });
};
