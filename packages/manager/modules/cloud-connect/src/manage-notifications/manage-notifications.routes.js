import { TRACKING_PREFIX, TRACKING_CONTEXT } from '../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.index.managenotifications', {
    url: '?uuid',
    params: {
      uuid: null,
      description: null,
    },
    views: {
      modal: {
        component: 'ovhCloudConnectManageNotifications',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state, $timeout, Alerter, atInternet) => (
        message = false,
        type = 'success',
      ) => {
        const TRACKING_ACTION = message ? 'confirm' : 'cancel';
        atInternet.trackClick({
          name: `${TRACKING_PREFIX}'::pop-up::button::edit_notification-settings::${TRACKING_ACTION}'`,
          type: 'action',
          ...TRACKING_CONTEXT,
          page: {
            name: `${TRACKING_PREFIX}::cloud-connect::pop-up::edit::notifications::settings`,
          },
          page_category: 'pop-up',
        });

        const reload = message && type === 'success';
        const promise = $state.go(
          'cloud-connect.index',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() =>
              type === 'success'
                ? Alerter.success(message, 'cloud_connect_alert')
                : Alerter.error(message, 'cloud_connect_alert'),
            ),
          );
        }
        return promise;
      },
      uuid: /* @ngInject */ ($transition$) => $transition$.params().uuid,
      description: /* @ngInject */ ($transition$) =>
        $transition$.params().description,
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
