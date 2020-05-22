import isEmpty from 'lodash/isEmpty';
import template from './GENERAL_INFORMATIONS.html';

const commonResolves = {
  availableOptions: /* @ngInject */ (
    $q,
    domainName,
    OvhApiOrderCartServiceOption,
  ) =>
    OvhApiOrderCartServiceOption.v6()
      .get({
        productName: 'domain',
        serviceName: domainName,
      })
      .$promise.catch(() => $q.resolve([])),

  detachableStart10m: /* @ngInject */ (
    Hosting,
    ovhManagerProductOffersDetachService,
    start10mHosting,
  ) =>
    start10mHosting
      ? Hosting.getServiceInfos(start10mHosting.serviceName)
          .then((start10mHostingInfo) =>
            start10mHostingInfo
              ? ovhManagerProductOffersDetachService
                  .getAvailableDetachPlancodes(start10mHostingInfo.serviceId)
                  .then((plancodes) => ({
                    serviceId: start10mHostingInfo.serviceId,
                    detachPlancodes: plancodes,
                  }))
                  .catch(() => null)
              : null,
          )
          .catch(() => null)
      : null,

  dnsAvailableOptions: /* @ngInject */ (domainName, WucOrderCartService) =>
    WucOrderCartService.getProductServiceOptions(
      'dns',
      domainName,
    ).catch(() => []),

  start10mHosting: /* @ngInject */ (domainName, DomainGeneralInformation) =>
    DomainGeneralInformation.getDomainOptions(domainName).then(
      ({ hosting }) => hosting,
    ),
  start10mOffers: /* @ngInject */ (availableOptions) =>
    availableOptions.filter(({ family }) => family === 'hosting'),

  isStart10mOfferAvailable: /* @ngInject */ (start10mOffers) =>
    !isEmpty(start10mOffers),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain.product.information', {
    url: '/information',
    views: {
      domainView: {
        template,
        controller: 'DomainTabGeneralInformationsCtrl',
        controllerAs: '$ctrl',
      },
    },
    atInternet: {
      rename: 'GENERAL_INFORMATIONS',
    },
    resolve: {
      ...commonResolves,
      goToDashboard: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.domain.product.information');

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
      detachFreeWebhostingLink: /* @ngInject */ ($state, domainName) =>
        $state.href('app.domain.product.information.detach-free-webhosting', {
          productId: domainName,
        }),
      enableWebhostingLink: /* @ngInject */ ($state, domainName) =>
        $state.href('app.domain.product.information.enable-webhosting', {
          productId: domainName,
        }),
    },
  });

  $stateProvider.state('app.domain.alldom.information', {
    url: '/information',
    views: {
      domainView: {
        template,
        controller: 'DomainTabGeneralInformationsCtrl',
        controllerAs: '$ctrl',
      },
    },
    atInternet: {
      rename: 'GENERAL_INFORMATIONS',
    },
    resolve: {
      ...commonResolves,
      goToDashboard: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.domain.alldom.information');

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
      detachFreeWebhostingLink: /* @ngInject */ ($state) =>
        $state.href('app.domain.alldom.information.detach-free-webhosting'),
      enableWebhostingLink: /* @ngInject */ ($state, allDom, domainName) =>
        $state.href('app.domain.alldom.information.enable-webhosting', {
          allDom,
          productId: domainName,
        }),
    },
  });
};
