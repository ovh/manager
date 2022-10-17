import get from 'lodash/get';

import {
  BRING_YOUR_OWN_IP,
  SERVICE_TYPES,
  ADDITIONAL_IP,
} from './ip-ip.constant';

export default /* @ngInject */
(
  $http,
  $location,
  $q,
  $scope,
  $state,
  $stateParams,
  $translate,
  Alerter,
  goToAntispam,
  goToFirewall,
  goToOrganisation,
  goToAgoraOrder,
  goToByoipConfiguration,
  Ip,
  ipFeatureAvailability,
  trackPage,
  trackClick,
  isByoipAvailable,
) => {
  $scope.isByoipAvailable = isByoipAvailable;

  $scope.alerts = {
    mitigation: [],
    antihack: [],
    arp: [],
    spam: [],
  };
  $scope.BRING_YOUR_OWN_IP = BRING_YOUR_OWN_IP;
  $scope.ADDITIONAL_IP = ADDITIONAL_IP;

  function init() {
    $scope.loading = {};
    $scope.state = {};
    $scope.services = [];
    $scope.serviceTypes = [];
    $scope.selectedService = null;
    $scope.selectedServiceType = null;
    $scope.serviceType = $stateParams.serviceType || null;
  }

  function fetchServiceTypes() {
    return $http
      .get('/ip.json')
      .then(({ data }) => data)
      .then((schema) => {
        $scope.serviceTypes = [
          'all',
          ...schema.models['ip.IpTypeEnum'].enum.filter((serviceType) =>
            SERVICE_TYPES.includes(serviceType),
          ),
        ];
        $scope.selectedServiceType =
          $scope.serviceType === null ? 'all' : $scope.serviceType;
      });
  }

  $scope.goToAgoraOrder = goToAgoraOrder;
  $scope.goToByoipConfiguration = goToByoipConfiguration;

  $scope.singleService = () =>
    $scope.serviceType && $scope.serviceType !== 'failover';

  Ip.getPriceForParking().then((price) => {
    $scope.parkPrice = price;
  });

  function refreshAlerts(ips) {
    $scope.loading.alerts = true;
    $scope.alerts = {
      mitigation: [],
      antihack: [],
      arp: [],
      spam: [],
    };
    return Ip.fetchAlerts({ ips, serviceType: $scope.serviceType })
      .then((alerts) => {
        $scope.alerts = alerts;
      })
      .finally(() => {
        $scope.loading.alerts = false;
      });
  }

  $scope.selectServiceType = (serviceType) => {
    $scope.serviceType = serviceType === 'all' ? null : serviceType;
    $location.search('serviceType', $scope.serviceType);
    $scope.$broadcast('ips.table.reload');
    refreshAlerts();
  };

  $scope.navigateToService = (serviceName) => {
    $state.go('app.ip', { page: 1, serviceName }, { reload: true });
  };

  $scope.alertsCount = function alertsCount() {
    return (
      get($scope, 'alerts.spam', []).length +
      get($scope, 'alerts.antihack', []).length +
      get($scope, 'alerts.arp', []).length +
      get($scope, 'alerts.mitigation', []).length
    );
  };

  $scope.$on('organisation.change.done', () => {
    init();
    Alerter.success(
      $translate.instant('ip_organisation_change_organisations_done'),
    );
  });

  // Views switch
  $scope.$on('ips.display', (e, selectedView) => {
    if (selectedView === 'organisation') {
      $scope.displayOrganisation();
    }
  });

  $scope.displayOrganisation = function displayOrganisation() {
    trackClick('manage-organisation');
    goToOrganisation().then(() =>
      $scope.$broadcast('ips.organisation.display'),
    );
  };

  if ($location.search().action === 'firewall' && $location.search().ip) {
    goToFirewall($location.search().ip);
  }

  if (
    $location.search().action === 'antispam' &&
    $location.search().ip &&
    $location.search().ipSpamming
  ) {
    goToAntispam($location.search().ip);
  }

  init();
  refreshAlerts();
  fetchServiceTypes();
};
