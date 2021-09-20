import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.new', {
    url: '/new',
    component: 'domainDnsZoneNew',
    resolve: {
      navigationInformations: /* @ngInject */ (Navigator, $rootScope) => {
        set($rootScope, 'currentSectionInformation', 'newDnsZone');
        return Navigator.setNavigationInformation({
          leftMenuVisible: true,
          configurationSelected: true,
        });
      },

      catalog: /* @ngInject */ (OvhApiOrder, user) =>
        OvhApiOrder.Catalog()
          .Public()
          .v6()
          .get({
            productName: 'dns',
            ovhSubsidiary: user.ovhSubsidiary,
          }).$promise,

      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'app.zone.new',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(
                `alert-${type}`,
                message,
                null,
                'newdnszone.alerts.main',
              ),
            ),
          );
        }

        return promise;
      },

      isZoneValid: /* @ngInject */ () => Promise.resolve(true),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('domains_newdnszone_order_title'),
    },
  });
};
