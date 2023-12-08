import controller from './domain-zone-dns.controller';
import template from './domain-zone-dns.html';

export default /* @ngInject */ ($stateProvider) => {
  const commonResolve = {
    goToZoneHistory: /* @ngInject */ ($state) => (params) =>
      $state.go('app.zone.details.zone-history', params),
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('domain_zone'),
  };
  $stateProvider.state('app.domain.product.zone', {
    url: '/zone',
    views: {
      domainView: {
        template,
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
      },
    },
    atInternet: {
      rename: 'ZONE',
    },
    resolve: {
      ...commonResolve,
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone.activate'),
      orderZone: /* @ngInject */ ($state) => () =>
        $state.go('app.dns-zone-new'),
      goToZone: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go('app.domain.product.zone', null, {
          reload,
        });

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
    },
  });

  $stateProvider.state('app.alldom.domain.zone', {
    url: '/zone',
    views: {
      domainView: {
        template,
        controller,
        controllerAs: 'ctrlDomainTabZoneDns',
      },
    },
    atInternet: {
      rename: 'ZONE',
    },
    resolve: {
      ...commonResolve,
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.alldom.domain.zone.activate'),
      orderZone: /* @ngInject */ ($state) => () =>
        $state.go('app.dns-zone-new'),
      goToZone: /* @ngInject */ ($state) => () =>
        $state.go('app.alldom.domain.zone'),
    },
  });
};
