import controller from '../../domain/zone/domain-zone-dns.controller';
import template from '../../domain/zone/domain-zone-dns.html';

import { SUCCESS_TYPE } from './dns-zone-dashboard.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.dashboard', {
    views: {
      'dnsZoneView@app.zone.details': {
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
        template,
      },
    },
    resolve: {
      goToZoneHistory: /* @ngInject */ ($state) => (params) =>
        $state.go('app.zone.details.zone-history', params),
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone.activate'),
      orderZone: /* @ngInject */ ($state) => () =>
        $state.go('app.dns-zone-new'),
      goToZone: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = SUCCESS_TYPE,
      ) => {
        const reload = message && type === SUCCESS_TYPE;

        const promise = $state.go('app.domain.product.zone', null, {
          reload,
        });

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
      breadcrumb: () => null,
    },
  });
};
