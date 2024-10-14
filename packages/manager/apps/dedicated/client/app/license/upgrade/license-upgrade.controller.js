export default /* @ngInject */ (
  $scope,
  $translate,
  License,
  Alerter,
  $stateParams,
) => {
  $scope.alerts = {
    upgrade: 'license.alerts.upgrade',
  };

  $scope.loaders = {
    init: false,
    orderableVersion: true,
    durations: false,
    prices: false,
    bc: false,
    loadedContract: false,
  };

  $scope.license = null;

  function getResetedOptions() {
    return {
      PLESK: {
        domainNumber: {
          mandatory: false,
          value: null,
        },
        antivirus: null,
        languagePackNumber: null,
        powerpack: null,
        version: null,
      },
      VIRTUOZZO: {
        containerNumber: {
          mandatory: true,
          value: null,
        },
      },
      WINDOWS: {
        version: null,
        sqlVersion: null,
      },
      WORKLIGHT: {
        version: {
          mandatory: true,
          value: null,
        },
      },
    };
  }

  function getWhatToSendFromSelected() {
    const opts = {
      licenseType: $scope.license.type,
      id: $scope.license.id,
      serviceId: $scope.serviceInfo.serviceId,
      options: $scope.selected.options[$scope.license.type],
    };
    switch ($scope.license.type) {
      case 'SQLSERVER':
      case 'WINDOWS':
      case 'CPANEL':
      case 'WORKLIGHT':
        if ($scope.selected.options[$scope.license.type].version !== null) {
          opts.version =
            $scope.selected.options[$scope.license.type].version.value;
        }
        break;
      default:
        break;
    }
    return opts;
  }

  const getUpgradeVersion = () => {
    $scope.loaders.orderableVersion = true;
    License.getServiceId($scope.license)
      .then((data) => {
        $scope.serviceInfo = data;
        return License.getUpgradeVersion($scope.serviceInfo.serviceId);
      })
      .then((data) => {
        $scope.types = data;
        if ($scope.types) {
          if ($scope.types.length > 0) {
            $scope.selected.version = $scope.types.find((type) => {
              return $scope.license.version === type.productName;
            });
            $scope.selected.options = getResetedOptions();
          } else {
            Alerter.alertFromSWS(
              $translate.instant('license_upgrade_common_no_upgrade'),
              'ERROR',
              $scope.alerts.upgrade,
            );
          }
        } else {
          Alerter.alertFromSWS(
            $translate.instant('license_order_loading_error'),
            'ERROR',
            $scope.alerts.upgrade,
          );
        }
        $scope.loaders.orderableVersion = false;
      });
  };

  function init() {
    $scope.loaders.init = true;
    return License.get('/{licenseId}', {
      urlParams: $stateParams,
    })
      .then((license) => {
        $scope.license = license;
      })
      .then(() => {
        getUpgradeVersion();
      })
      .finally(() => {
        $scope.loaders.init = false;
      });
  }

  $scope.isPleskVersion10 = function isPleskVersion10(plesk) {
    return !!/^PLESK_10.+$/.test(plesk.version);
  };

  function getResetedDurations() {
    return {
      available: null,
      details: {},
    };
  }

  $scope.types = {};

  $scope.selected = {
    ipBlock: null,
    ip: null,
    version: null,
    options: null,
    duration: null,
  };

  $scope.filters = {
    block: {
      type: null,
      search: null,
    },
  };

  $scope.hasMoreOptions = function hasMoreOptions() {
    return (
      $scope.license &&
      $scope.selected.options &&
      $scope.selected.options[$scope.license.type] !== null
    );
  };

  $scope.isSelectionValid = function isSelectionValid() {
    let valid = true;
    let atLeastOne = false;
    let moreOptions;
    if (
      $scope.license &&
      $scope.license.type &&
      $scope.selected.options &&
      $scope.selected.options[$scope.license.type]
    ) {
      moreOptions = $scope.selected.options[$scope.license.type];
      angular.forEach(moreOptions, (value) => {
        atLeastOne =
          atLeastOne ||
          (angular.isObject(value) && value.value !== null) ||
          (angular.isString(value) && value !== null);
        valid =
          valid &&
          (value === null ||
            !value.mandatory ||
            (value.mandatory &&
              value.value !== null &&
              (value.shouldBeEqualsTo === undefined ||
                value.shouldBeEqualsTo === value.value)));
      });
    }

    return valid && atLeastOne;
  };

  $scope.getOptionVersions = function getOptionVersions() {
    return $scope.types
      .filter((version) => version.productName !== $scope.license.version)
      .sort(({ productName: a }, { productName: b }) => (a > b ? 1 : -1));
  };

  $scope.$watch(
    'selected.options',
    () => {
      $scope.selected.duration = null;
      $scope.loaders.bc = false;
      $scope.order = null;
      $scope.durations = getResetedDurations();
      $scope.getDuration();
    },
    true,
  );

  $scope.$watch(
    'selected.duration',
    () => {
      $scope.loaders.bc = false;
      $scope.order = null;
      $scope.loaders.loadedContract = false;
    },
    true,
  );

  $scope.durations = getResetedDurations();

  $scope.getDuration = function getDuration() {
    if (!$scope.loaders.durations && $scope.isSelectionValid()) {
      $scope.loaders.durations = true;
      $scope.loaders.prices = true;
      const asking = getWhatToSendFromSelected();
      return License.upgradeDuration(asking).then(
        (durations) => {
          const renewPrice = durations.prices?.find((price) =>
            price.capacities.includes('renew'),
          );
          if (angular.equals(asking, getWhatToSendFromSelected())) {
            $scope.durations.available = '01';
            $scope.durations.details[$scope.durations.available] = {
              ...renewPrice,
            };
          }

          $scope.loaders.durations = false;
          $scope.loaders.prices = false;
        },

        (data) => {
          $scope.loaders.durations = false;
          Alerter.alertFromSWS(
            $translate.instant('license_order_loading_error'),
            data.data,
            $scope.alerts.upgrade,
          );
        },
      );
    }
    return null;
  };

  $scope.simulateUpgrade = function simulateUpgrade() {
    $scope.loaders.loadedContract = false;
    const asking = getWhatToSendFromSelected();
    License.simulateLicenseUpgrade(asking).then(({ order }) => {
      $scope.orderDetails = order;
      $scope.loaders.loadedContract = true;
    });
  };

  $scope.contractsValidated = {
    value: null,
  };

  $scope.selectDuration = function selectDuration() {
    $scope.contractsValidated = {
      value: null,
    };
    $scope.simulateUpgrade();
  };

  $scope.generateBc = function generateBc() {
    $scope.loaders.bc = true;
    const opt = getWhatToSendFromSelected();
    opt.duration = $scope.selected.duration;
    opt.upgradePrice = $scope.orderDetails?.details[0].totalPrice.value;
    License.upgradeLicenseOrderForDuration(opt).then(
      ({ order }) => {
        $scope.order = order;
        $scope.loaders.bc = false;
      },
      (data) => {
        Alerter.alertFromSWS(
          $translate.instant('license_order_loading_error'),
          data.data,
          $scope.alerts.upgrade,
        );
        $scope.loaders.bc = false;
      },
    );
  };

  $scope.openBc = function openBc() {
    window.open($scope.order.url);
  };

  $scope.order = null;

  $scope.getWindowsSqlOptionsList = function getWindowsSqlOptionsList() {
    if ($scope.selected.options && $scope.selected.options.WINDOWS.version) {
      return $scope.selected.options.WINDOWS.version.options;
    }

    if ($scope.selected.version !== null) {
      return $scope.selected.version.options;
    }

    return [];
  };

  init();
};
