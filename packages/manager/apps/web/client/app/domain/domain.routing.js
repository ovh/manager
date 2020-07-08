import clone from 'lodash/clone';
import isEmpty from 'lodash/isEmpty';

import anycastState from './anycast/domain-dns-anycast.state';
import dnsState from './dns/domain-dns.state';
import redirectionState from './redirection/domain-redirection.state';
import dynHostState from './dynhost/domain-dynhost.state';
import glueState from './glue/domain-glue.state';
import dnsSecState from './dnssec/domain-dnssec.state';
import tasksState from './tasks/domain-tasks.state';

const commonResolves = {
  associatedHostings: /* @ngInject */ (Domain, domainName) =>
    Domain.getAssociatedHosting(domainName).catch(() => []),
  hasEmailDomain: /* @ngInject */ ($http, domainName) =>
    $http
      .get(`/email/domain/${domainName}`)
      .then(() => true)
      .catch(() => false),
  zoneOption: /* @ngInject */ ($http, domainName) =>
    $http
      .get(`/domain/${domainName}/options`)
      .then((options) => options.data.zone),
  zoneCapabilities: /* @ngInject */ (DNSZoneService, zoneOption) =>
    zoneOption
      ? DNSZoneService.getCapabilities(zoneOption.serviceName)
      : { dynHost: false },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.domain', {
    abstract: true,
    template: '<div ui-view></div>',
  });

  $stateProvider.state('app.domain.product', {
    url: '/configuration/domain/:productId',
    templateUrl: 'domain/domain.html',
    controller: 'DomainCtrl',
    controllerAs: 'ctrlDomain',
    reloadOnSearch: false,
    atInternet: {
      ignore: true, // this tell AtInternet to not track this state
    },
    redirectTo: 'app.domain.product.information',
    resolve: {
      ...commonResolves,
      currentSection: () => 'domain',
      domain: /* @ngInject */ (Domain, domainName) =>
        Domain.getSelected(domainName),
      domainName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      goToWebhostingOrder: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.webhosting.order'),
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'domain';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      orderedHosting: /* @ngInject */ ($q, domainName, Hosting) =>
        Hosting.getSelected(domainName)
          .then(({ offer, serviceName }) =>
            isEmpty(offer) ? null : serviceName,
          )
          .catch((error) => (error.code === 404 ? null : $q.reject(error))),

      goToDns: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.dns'),
      goToDnsAnycast: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.product.anycast'),
    },
    translations: {
      value: [
        '../core',
        '../domain',
        '../email',
        '../hosting',
        '../domain-operation',
      ],
      format: 'json',
    },
  });

  $stateProvider.state('app.domain.alldom', {
    url: '/configuration/all_dom/:allDom/:productId',
    templateUrl: 'domain/domain.html',
    controller: 'DomainCtrl',
    controllerAs: 'ctrlDomain',
    reloadOnSearch: false,
    redirectTo: 'app.domain.alldom.information',
    resolve: {
      ...commonResolves,
      allDom: /* @ngInject */ ($transition$) => $transition$.params().allDom,
      currentSection: () => 'domain',
      domain: /* @ngInject */ (Domain, domainName) =>
        Domain.getSelected(domainName),
      domainName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      goToWebhostingOrder: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.alldom.webhosting.order'),
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'all_dom';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      orderedHosting: /* @ngInject */ ($q, domainName, Hosting) =>
        Hosting.getSelected(domainName)
          .then(({ offer, serviceName }) =>
            isEmpty(offer) ? null : serviceName,
          )
          .catch((error) => (error.code === 404 ? null : $q.reject(error))),

      goToDns: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.alldom.dns'),
      goToDnsAnycast: /* @ngInject */ ($state) => () =>
        $state.go('app.domain.alldom.anycast'),
    },
    translations: {
      value: [
        '../core',
        '../domain',
        '../email',
        '../hosting',
        '../domain-operation',
      ],
      format: 'json',
    },
  });

  ['product', 'alldom'].forEach((stateType) => {
    // Clone state before using it as it will be modified by UI Router
    $stateProvider.state(
      `app.domain.${stateType}.anycast`,
      clone(anycastState),
    );
    $stateProvider.state(`app.domain.${stateType}.dns`, clone(dnsState));
    $stateProvider.state(
      `app.domain.${stateType}.redirection`,
      clone(redirectionState),
    );
    $stateProvider.state(
      `app.domain.${stateType}.dynhost`,
      clone(dynHostState),
    );
    $stateProvider.state(`app.domain.${stateType}.glue`, clone(glueState));
    $stateProvider.state(`app.domain.${stateType}.dnssec`, clone(dnsSecState));
    $stateProvider.state(`app.domain.${stateType}.tasks`, clone(tasksState));
  });
};
