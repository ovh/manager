import { ISSUE_CATEGORY, ISSUE_SERVICE_TYPE } from './increase.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quota.increase', {
    url: '/increase/:mode',
    views: {
      modal: {
        component: 'pciProjectQuotaIncrease',
      },
    },
    layout: 'modal',
    resolve: {
      mode: /* @ngInject */ ($transition$) => $transition$.params().mode,
      breadcrumb: () => null,
      issueTypes: /* @ngInject */ (OvhApiSupport, $translate) =>
        OvhApiSupport.v6().getIssueTypes({
          category: ISSUE_CATEGORY,
          language: $translate.use(),
          serviceType: ISSUE_SERVICE_TYPE,
        }).$promise,
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
