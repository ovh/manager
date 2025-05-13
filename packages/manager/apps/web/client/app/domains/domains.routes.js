import { DOMAIN_PREFIX_LISTING_MANAGE_DOMAINS } from './domains.constant';

angular.module('App').config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.domain.all', {
    url: '/bulk',
    component: 'domains',
    resolve: {
      navigationInformations: [
        'Navigator',
        '$rootScope',
        (Navigator, $rootScope) => {
          // eslint-disable-next-line no-param-reassign
          $rootScope.currentSectionInformation = 'domains';
          return Navigator.setNavigationInformation({
            leftMenuVisible: true,
            configurationSelected: true,
          });
        },
      ],
      hideBreadcrumb: () => true,
    },
    atInternet: {
      rename: DOMAIN_PREFIX_LISTING_MANAGE_DOMAINS,
    },
    translations: { value: ['../domain', '../domains'], format: 'json' },
  });

  $urlRouterProvider.when(
    /^\/configuration\/domains$/,
    /* @ngInject */ ($location) => {
      $location.url(
        $location.url().replace('/configuration/domains', '/domain/bulk'),
      );
    },
  );
});
