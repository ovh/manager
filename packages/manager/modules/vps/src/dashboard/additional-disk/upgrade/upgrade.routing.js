export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.additional-disk-upgrade', {
    url: '/additional-disk-upgrade',
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
    atInternet: {
      rename: 'vps::detail::additional-disk::upgrade',
    },
  });
};
