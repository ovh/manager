import isEmpty from 'lodash/isEmpty';
import template from './domain-general-informations.html';

import './general-information.styles.scss';

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

  dnsAvailableOptions: /* @ngInject */ (domainName, WucOrderCartService) =>
    WucOrderCartService.getProductServiceOptions(
      'dns',
      domainName,
    ).catch(() => []),

  emailObfuscationLink: /* @ngInject */ ($state, domainName) =>
    $state.href('app.domain.product.emailObfuscation', {
      productId: domainName,
    }),

  start10mOffers: /* @ngInject */ (availableOptions) =>
    availableOptions.filter(({ family }) => family === 'hosting'),

  isStart10mAvailable: /* @ngInject */ (start10mOffers) =>
    !isEmpty(start10mOffers),

  breadcrumb: () => null,
};

export default /* @ngInject */ ($stateProvider, $urlRouterProvider) => {
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
      goToContactManagement: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.domain.product.contact');

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
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

      enableWebhostingLink: /* @ngInject */ ($state, domainName) =>
        $state.href('app.domain.product.information.enable-webhosting', {
          productId: domainName,
        }),

      optinLink: /* @ngInject */ ($state, domainName) =>
        $state.href('app.domain.product.optin', {
          productId: domainName,
        }),
    },
  });

  $urlRouterProvider.when(
    /^\/domain\/[^/]+\/information/,
    /* @ngInject */ (ovhFeatureFlipping, coreURLBuilder, $state, $location) => {
      ovhFeatureFlipping
        .checkFeatureAvailability('web-domains:domains')
        .then((featureAvailability) => {
          return featureAvailability.isFeatureAvailable('web-domains:domains');
        })
        .then((isFeatureAvailable) => {
          if (isFeatureAvailable) {
            const path = $location.path();
            const productId = path.split('/')[2];
            const url = coreURLBuilder.buildURL(
              'web-domains',
              '#/domain/:serviceName/information',
              { serviceName: productId },
            );
            return window.location.replace(url);
          }
          $state.go('app.domain.product.information');
          return false;
        });
    },
  );

  $stateProvider.state('app.alldom.domain.information', {
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
      goToContactManagement: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.alldom.domain.contact');

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },
      goToDashboard: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.alldom.domain.information');

        if (message) {
          promise.then(() => Alerter[type](message, 'domain_alert_main'));
        }

        return promise;
      },

      enableWebhostingLink: /* @ngInject */ ($state, allDom, domainName) =>
        $state.href('app.alldom.domain.information.enable-webhosting', {
          allDom,
          productId: domainName,
        }),
      optinLink: /* @ngInject */ ($state, allDom, domainName) =>
        $state.href('app.alldom.domain.optin', {
          allDom,
          productId: domainName,
        }),
    },
  });
};
