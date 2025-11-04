export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.additional-disk.upgrade', {
    url: '/upgrade',
    views: {
      modal: {
        component: 'ovhManagerVpsComponentAdditionalDiskUpgrade',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state, $timeout, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('^');
        if (message) {
          promise.then(() =>
            $timeout(() =>
              CucCloudMessage[type]({
                textHtml: message,
              }),
            ),
          );
        }
        return promise;
      },
    },
  });
};
