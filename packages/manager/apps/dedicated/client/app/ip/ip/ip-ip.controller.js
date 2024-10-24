import { debounce } from 'lodash';
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
  $state,
  Alerter,
  goToAntispam,
  goToFirewall,
  goToOrganisation,
  goToVrack,
  goToAgoraOrder,
  goToByoipConfiguration,
  Ip,
  trackClick,
  isByoipAvailable,
  isDeleteByoipServiceAvailable,
  goToGameFirewall,
  orderIpAvailable,
  trackPage,
  trackingData,
  ipServiceData,
  goToStatistics,
) => {
  $scope.BRING_YOUR_OWN_IP = BRING_YOUR_OWN_IP;
  $scope.ADDITIONAL_IP = ADDITIONAL_IP;

  $scope.goToAgoraOrder = goToAgoraOrder;
  $scope.goToAntispam = goToAntispam;
  $scope.goToByoipConfiguration = goToByoipConfiguration;
  $scope.goToFirewall = goToFirewall;
  $scope.goToGameFirewall = goToGameFirewall;
  $scope.goToOrganisation = goToOrganisation;
  $scope.goToVrack = goToVrack;
  $scope.isByoipAvailable = isByoipAvailable;
  $scope.isDeleteByoipServiceAvailable = isDeleteByoipServiceAvailable;
  $scope.orderIpAvailable = orderIpAvailable;
  $scope.selection = { service: null, serviceType: null };
  $scope.listParams = {};
  $scope.services = [];
  $scope.serviceTypes = [];
  $scope.trackClick = trackClick;
  $scope.trackingData = trackingData;
  $scope.trackPage = trackPage;
  // Prevent serviceSelector / serviceTypeSelector elements from creating their own ng-model variables
  // on their own transcluded scope which break scope inheritance
  $scope.ipScope = $scope;
  $scope.goToStatistics = goToStatistics;

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
          $scope.selection.serviceType = $stateParams.serviceType;
        }
      });
  }

  function fetchServices() {
    return Ip.getServicesList().then((services) => {
      $scope.services = services
        .sort(({ serviceName: a }, { serviceName: b }) => (a > b ? 1 : -1))
        .map((service) => ({
          ...service,
          displayName:
            service.displayName !== service.serviceName
              ? `${service.displayName} <br><small>(${service.serviceName})</small>`
              : `${service.serviceName}`,
          translatedCategory: $translate.instant(
            `ip_filter_services_title_${service.category}`,
          ),
        }));

      $scope.services.unshift({
        serviceName: null,
        displayName: $translate.instant('ip_filter_services__ALL'),
      });

      if ($stateParams.serviceName) {
        $scope.selection.service = { serviceName: $stateParams.serviceName };
      }
    });
  }

  $scope.getServiceTypeLabel = function getServiceTypeLabel(item) {
    return item.translatedCategory;
  };

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
    $location.search('ipService', '');
    $location.search('page', 1);
  };

  $scope.onListParamDeleted = function onListParamDeleted(param) {
    if (param === 'ip') {
      $scope.select({ serviceType: null, service: null });
    }
  };

  $scope.displayOrganisation = function displayOrganisation() {
    trackClick('manage-organisation');
    goToOrganisation().then(() =>
      $scope.$broadcast('ips.organisation.display'),
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

  const debouncedReload = debounce(
    () => $timeout(() => $scope.$broadcast('ips.table.reload')),
    200,
  );

  // State management & grid reload
  // React to both user selections and url changes (including back / force mecanism)
  $scope.$watch(
    () => {
      const { ipService, serviceName, serviceType } = $location.search();
      return {
        selection: $scope.selection,
        params: { ipService, serviceName, serviceType },
      };
    },
    ({ params: { ipService, serviceName, serviceType } }) => {
      if (ipService && !ipServiceData) {
        return $state.go(
          'app.ip',
          { ipService, serviceType: null, serviceName: null },
          { reload: true },
        );
      }
      $scope.selection.serviceType = serviceType
        ? $scope.serviceTypes.find((item) => item === serviceType)
        : null;
      $scope.selection.service = serviceName
        ? $scope.services.find((item) => item.serviceName === serviceName)
        : null;
      $scope.listParams = {
        ...(ipService && ipServiceData && { ip: ipServiceData.ip }),
        serviceName: $scope.selection.service?.serviceName || null,
      };
      return debouncedReload();
    },
    true,
  );

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
