import head from 'lodash/head';

export default /* @ngInject */ (
  $scope,
  $q,
  $translate,
  IpLegacyOrder,
  User,
  Alerter,
  $rootScope,
  Validator,
) => {
  $scope.loading = {
    step1: false,
    checkServiceMigrateable: false,
    durations: false,
    prices: false,
    validation: false,
  };
  $scope.migrateableIpError = null;

  $scope.servicesList = null;
  $scope.user = {};
  $scope.migrate = {
    ip: null,
    token: null,
    service: null,
    duration: null,
  };
  $scope.durations = {
    available: [],
    details: {},
  };
  $scope.agree = {
    value: false,
  };

  /*= =============================
    =            STEP 1            =
    ============================== */

  $scope.isValidIp = function isValidIp(ip) {
    if (ip != null) {
      const ipslash = ip.split('/');
      if (ipslash.length > 1) {
        return (
          (Validator.isValidIpv4(ipslash[0]) &&
            ipslash[1] > 0 &&
            ipslash[1] < 33) ||
          (Validator.isValidIpv6(ipslash[0]) &&
            ipslash[1] > 0 &&
            ipslash[1] < 129)
        );
      }
      return Validator.isValidIpv4(ip) || Validator.isValidIpv6(ip);
    }
    return false;
  };

  /*= =============================
    =            STEP 2            =
    ============================== */

  $scope.getServices = function getServices() {
    const queue = [];
    $scope.loading.step2 = true;
    Alerter.resetMessage('otrs_alert_migration');
    $scope.servicesList = null;
    $scope.user = {};

    queue.push(
      IpLegacyOrder.getServicesByType('DEDICATED').then((services) => {
        $scope.servicesList = services;
        $scope.migrate.service = null;
        $scope.durations.available = null;
      }),
    );

    queue.push(
      User.getUser().then((data) => {
        $scope.user = data;
      }),
    );

    $q.all(queue).then(
      () => {
        $scope.loading.step2 = false;
      },
      (data) => {
        Alerter.alertFromSWS(
          $translate.instant('ip_migration_step1_error'),
          data.data,
        );
        $scope.loading.step1 = false;
        $scope.resetAction();
      },
    );
  };

  $scope.checkServiceMigrateable = function checkServiceMigrateable() {
    $scope.loading.checkServiceMigrateable = true;
    $scope.durations = {
      available: [],
      details: {},
    };
    $scope.migrateableIpError = null;
    Alerter.resetMessage('otrs_alert_migration');

    // First, check if option is ordorable
    IpLegacyOrder.checkIfAllowed($scope.migrate.service, 'ipMigration').then(
      (serviceAllowed) => {
        if (!serviceAllowed) {
          $scope.migrateableIpError = 'OPTION_NOT_ALLOWED';
          $scope.loading.checkServiceMigrateable = false;
          return;
        }

        // Check specific migrateable params
        IpLegacyOrder.getServiceMigrateableIp($scope.migrate).then(
          (infos) => {
            if (!infos) {
              $scope.migrateableIpError = 'INCOMPATIBLE';
            } else {
              $scope.durations.available = infos;
            }
            $scope.loading.checkServiceMigrateable = false;
          },
          (data) => {
            $scope.loading.checkServiceMigrateable = false;
            if (data.status === 460) {
              $scope.migrateableIpError = 'EXPIRED';
            } else {
              $scope.migrateableIpError = 'ANOTHER';
              Alerter.alertFromSWS(
                $translate.instant('ip_migration_step1_error'),
                data.data,
                'otrs_alert_migration',
              );
            }
          },
        );
      },
      (data) => {
        $scope.loading.checkServiceMigrateable = false;
        Alerter.alertFromSWS(
          $translate.instant('ip_migration_step2_error'),
          data,
        ); // no data.data
        $scope.resetAction();
      },
    );
  };

  /*= =============================
    =            STEP 3            =
    ============================== */

  $scope.getDurations = function getDurations() {
    const queue = [];
    $scope.loading.prices = true;

    angular.forEach($scope.durations.available, (duration) => {
      queue.push(
        IpLegacyOrder.getMigrateIpOrder($scope.migrate, duration).then(
          (details) => {
            $scope.durations.details[duration] = details;
          },
        ),
      );
    });

    $q.all(queue).then(
      () => {
        if (
          $scope.durations.available &&
          $scope.durations.available.length === 1
        ) {
          $scope.migrate.duration = head($scope.durations.available);
        }
        $scope.loading.prices = false;
      },
      (data) => {
        Alerter.alertFromSWS(
          $translate.instant('ip_migration_step3_error'),
          data.data,
        );
        $scope.resetAction();
      },
    );
  };

  /*= =============================
    =            STEP 4            =
    ============================== */

  $scope.loadContracts = function loadContracts() {
    $scope.agree.value = false;
    if (
      !$scope.durations.details[$scope.migrate.duration].contracts ||
      !$scope.durations.details[$scope.migrate.duration].contracts.length
    ) {
      $rootScope.$broadcast('wizard-goToStep', 7);
    }
  };

  $scope.backToContracts = function backToContracts() {
    if (
      !$scope.durations.details[$scope.migrate.duration].contracts ||
      !$scope.durations.details[$scope.migrate.duration].contracts.length
    ) {
      $rootScope.$broadcast('wizard-goToStep', 4);
    }
  };

  /*= =============================
    =            STEP 5            =
    ============================== */

  $scope.getResumePrice = function getResumePrice(price) {
    return price.value === 0
      ? $translate.instant('price_free')
      : $translate.instant('price_ht_label', { t0: price.text });
  };

  $scope.migrateIp = function migrateIp() {
    $scope.loading.validation = true;
    IpLegacyOrder.postMigrateIpOrder($scope.migrate)
      .then(
        (order) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_migration_step5_success', {
              t0: order.url,
              t1: order.orderId,
            }),
            { idTask: order.orderId, state: 'OK' },
          );
          window.open(order.url, '_blank');
        },
        (data) => {
          Alerter.alertFromSWS(
            $translate.instant('ip_migration_step5_error'),
            data.data,
          );
        },
      )
      .finally(() => {
        $scope.loading.validation = false;
        $scope.resetAction();
      });
  };
};
