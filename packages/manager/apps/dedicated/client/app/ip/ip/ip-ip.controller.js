import {
  BRING_YOUR_OWN_IP,
  SERVICE_TYPES,
  ADDITIONAL_IP,
} from './ip-ip.constant';

export default /* @ngInject */
(
  $http,
  $location,
  $scope,
  $stateParams,
  $translate,
  $timeout,
  $q,
  Alerter,
  goToAntispam,
  goToFirewall,
  goToOrganisation,
  goToAgoraOrder,
  goToByoipConfiguration,
  Ip,
  trackClick,
  isByoipAvailable,
  goToGameFirewall,
  orderIpAvailable,
  trackPage,
  trackingData,
) => {
  $scope.BRING_YOUR_OWN_IP = BRING_YOUR_OWN_IP;
  $scope.ADDITIONAL_IP = ADDITIONAL_IP;

  $scope.goToAgoraOrder = goToAgoraOrder;
  $scope.goToAntispam = goToAntispam;
  $scope.goToByoipConfiguration = goToByoipConfiguration;
  $scope.goToFirewall = goToFirewall;
  $scope.goToGameFirewall = goToGameFirewall;
  $scope.goToOrganisation = goToOrganisation;
  $scope.isByoipAvailable = isByoipAvailable;
  $scope.orderIpAvailable = orderIpAvailable;
  $scope.selectedService = null;
  $scope.selectedServiceType = null;
  $scope.services = [];
  $scope.serviceTypes = [];
  $scope.trackClick = trackClick;
  $scope.trackingData = trackingData;
  $scope.trackPage = trackPage;
  // Prevent serviceSelector / serviceTypeSelector elements from creating their own ng-model variables
  // on their own transcluded scope which break scope inheritance
  $scope.ipScope = $scope;

  function fetchServiceTypes() {
    return $http
      .get('/ip.json')
      .then(({ data }) => data)
      .then((schema) => {
        const ipTypeEnum = schema.models['ip.IpTypeEnum'].enum;
        $scope.serviceTypes = ipTypeEnum.filter((serviceType) =>
          SERVICE_TYPES.includes(serviceType),
        );
        if ($stateParams.serviceType) {
          $scope.selectedServiceType = $scope.serviceTypes.find(
            (serviceType) => serviceType === $stateParams.serviceType,
          );
        }
      });
  }

  function fetchServices() {
    return Ip.getServicesList().then((services) => {
      $scope.services = services.sort(
        ({ serviceName: a }, { serviceName: b }) => (a > b ? 1 : -1),
      );
      if ($stateParams.serviceName) {
        $scope.selectedService = $scope.services.find(
          ({ serviceName }) => serviceName === $stateParams.serviceName,
        );
      }
    });
  }

  function init() {
    $scope.loading = true;
    $q.all([fetchServiceTypes(), fetchServices()])
      .catch(() => {
        Alerter.error($translate.instant('ip_dashboard_error'), 'ip_error');
      })
      .finally(() => {
        $scope.loading = false;
      });
  }

  $scope.select = function select({ serviceType, service }) {
    $location.search('serviceType', serviceType);
    $location.search('serviceName', service?.serviceName);
    $location.search('page', 1);
    $scope.selectedServiceType = serviceType;
    $scope.selectedService = service;
    $timeout(() => $scope.$broadcast('ips.table.reload'));
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
};
