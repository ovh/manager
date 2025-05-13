export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.quota.increasecredits', {
    url: '/increase/buy-credits',
    views: {
      modal: {
        component: 'pciProjectQuotaIncreaseCredits',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
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
