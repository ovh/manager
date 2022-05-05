import { NASHA_ALERT_ID, NASHA_TITLE } from './nasha.constants';
import {
  localizeDatacenter,
  localizeOperation,
  prepareNasha,
  preparePartition,
} from './nasha.utils';

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('nasha', {
    url: '/nasha',
    template: `
      <div class="nasha">
          <div data-ovh-alert="${NASHA_ALERT_ID}"></div>
          <div data-ui-view></div>
      </div>
    `,
    redirectTo: (transition) =>
      transition
        .injector()
        .get('iceberg')('/dedicated/nasha')
        .query()
        .limit(1)
        .execute(null)
        .$promise.then(({ data }) =>
          data.length ? 'nasha.directory' : 'nasha.onboarding',
        ),
    resolve: {
      alert: /* @ngInject */ (Alerter) => (type, message) =>
        Alerter[type](message, NASHA_ALERT_ID),
      alertSuccess: /* @ngInject */ (alert) => (message) =>
        alert('success', message),
      alertError: /* @ngInject */ (alert, $translate) => (error) => {
        const message =
          error.data?.message || error.message || error.toString();
        alert('error', $translate.instant('nasha_error', { message }));
      },
      breadcrumb: () => NASHA_TITLE,
      localizeDatacenter: /* @ngInject */ ($translate) => (datacenter) =>
        localizeDatacenter(datacenter, $translate),
      localizeOperation: /* @ngInject */ ($translate) => (operation) =>
        localizeOperation(operation, $translate),
      prepareNasha: /* @ngInject */ ($translate) => (nasha) =>
        prepareNasha(nasha, $translate),
      preparePartition: /* @ngInject */ ($translate) => (partition) =>
        preparePartition(partition, $translate),
      trackingPrefix: () => NASHA_TITLE,
    },
  });

  $urlRouterProvider.when(/^\/paas\/nasha/, () => {
    window.location.href = window.location.href.replace(
      '/paas/nasha',
      '/nasha',
    );
  });
};
