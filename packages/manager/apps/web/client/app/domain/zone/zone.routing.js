import get from 'lodash/get';
import controller from './domain-zone-dns.controller';
import template from './domain-zone-dns.html';

const commonResolves = {
  detachZoneOptions: /* @ngInject */ (
    $q,
    ovhManagerProductOffersDetachService,
    serviceInfos,
  ) =>
    (serviceInfos
      ? ovhManagerProductOffersDetachService.getAvailableDetachPlancodes(
          serviceInfos.serviceId,
        )
      : $q.resolve([])
    ).catch(() => $q.resolve([])),
  serviceInfos: /* @ngInject */ ($http, $q, zoneOption) =>
    zoneOption
      ? $http
          .get(`/domain/zone/${get(zoneOption, 'serviceName')}/serviceInfos`)
          .then(({ data }) => data)
      : $q.resolve(),
  zoneOption: /* @ngInject */ ($http, domainName) =>
    $http
      .get(`/domain/${domainName}/options`)
      .then((options) => options.data.zone),
  breadcrumb: /* @ngInject */ ($translate) => $translate.instant('domain_zone'),
};

export default /* @ngInject */ ($stateProvider) => {
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
      ...commonResolves,
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.zone.activate'),
      detachZoneLink: /* @ngInject */ ($state, domainName) =>
        $state.href('app.domain.product.zone.detach', {
          productId: domainName,
        }),
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
      ...commonResolves,
      activateZone: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.alldom.zone.activate'),
      detachZoneLink: /* @ngInject */ ($state, domainName) =>
        $state.href('app.domain.alldom.zone.detach', {
          productId: domainName,
        }),
      orderZone: /* @ngInject */ ($state) => () =>
        $state.go('app.dns-zone-new'),
      goToZone: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go('app.domain.alldom.zone', null, {
          reload,
        });

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
    },
  });
};
