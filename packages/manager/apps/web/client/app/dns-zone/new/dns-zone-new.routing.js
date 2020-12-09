import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dns-zone-new', {
    url: '/configuration/new_dns_zone',
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
        OvhApiOrder.Catalog().Public().v6().get({
          productName: 'dns',
          ovhSubsidiary: user.ovhSubsidiary,
        }).$promise,

      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'app.dns-zone-new',
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

      isZoneValid: /* @ngInject */ (newDnsZone) => (name) =>
        newDnsZone
          .getZoneNameValidation(name)
          .then(() => true)
          .catch(() => false),
    },
    translations: { value: ['.'], format: 'json' },
  });
};
