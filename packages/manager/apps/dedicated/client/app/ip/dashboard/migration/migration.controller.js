import head from 'lodash/head';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $scope,
    $translate,
    Alerter,
    IpDashboardOrderLegacy,
    User,
    Validator,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.IpDashboardOrderLegacy = IpDashboardOrderLegacy;
    this.User = User;
    this.Validator = Validator;
  }

  $onInit() {
    this.$scope.loading = {
      step1: false,
      checkServiceMigrateable: false,
      durations: false,
      prices: false,
      validation: false,
    };
    this.$scope.migrateableIpError = null;

    this.$scope.goBack = this.goBack.bind(this);
    this.$scope.servicesList = null;
    this.$scope.user = {};
    this.$scope.migrate = {
      ip: null,
      token: null,
      service: null,
      duration: null,
    };
    this.$scope.durations = {
      available: [],
      details: {},
    };
    this.$scope.agree = {
      value: false,
    };

    /*= =============================
    =            STEP 1            =
    ============================== */

    this.$scope.isValidIp = (ip) => {
      if (ip != null) {
        const ipslash = ip.split('/');
        if (ipslash.length > 1) {
          return (
            (this.Validator.isValidIpv4(ipslash[0]) &&
              ipslash[1] > 0 &&
              ipslash[1] < 33) ||
            (this.Validator.isValidIpv6(ipslash[0]) &&
              ipslash[1] > 0 &&
              ipslash[1] < 129)
          );
        }
        return this.Validator.isValidIpv4(ip) || this.Validator.isValidIpv6(ip);
      }
      return false;
    };

    /*= =============================
    =            STEP 2            =
    ============================== */

    this.$scope.getServices = () => {
      const queue = [];
      this.$scope.loading.step2 = true;
      this.Alerter.resetMessage('otrs_alert_migration');
      this.$scope.servicesList = null;
      this.$scope.user = {};

      queue.push(
        this.IpDashboardOrderLegacy.getServicesByType('DEDICATED').then(
          (services) => {
            this.$scope.servicesList = services;
            this.$scope.migrate.service = null;
            this.$scope.durations.available = null;
          },
        ),
      );

      queue.push(
        this.User.getUser().then((data) => {
          this.$scope.user = data;
        }),
      );

      this.$q
        .all(queue)
        .then(() => {
          this.$scope.loading.step2 = false;
        })
        .catch((data) => {
          this.$scope.loading.step1 = false;

          return this.goBack({
            message: {
              text: this.$translate.instant('ip_migration_step1_error'),
              data: {
                ...data,
                type: 'ERROR',
              },
            },
          });
        });
    };

    this.$scope.checkServiceMigrateable = () => {
      this.$scope.loading.checkServiceMigrateable = true;
      this.$scope.durations = {
        available: [],
        details: {},
      };
      this.$scope.migrateableIpError = null;
      this.Alerter.resetMessage('otrs_alert_migration');

      // First, check if option is ordorable
      this.IpDashboardOrderLegacy.checkIfAllowed(
        this.$scope.migrate.service,
        'ipMigration',
      )
        .then((serviceAllowed) => {
          if (!serviceAllowed) {
            this.$scope.migrateableIpError = 'OPTION_NOT_ALLOWED';
            this.$scope.loading.checkServiceMigrateable = false;
            return;
          }

          // Check specific migrateable params
          this.IpDashboardOrderLegacy.getServiceMigrateableIp(
            this.$scope.migrate,
          )
            .then((infos) => {
              if (!infos) {
                this.$scope.migrateableIpError = 'INCOMPATIBLE';
              } else {
                this.$scope.durations.available = infos;
              }
              this.$scope.loading.checkServiceMigrateable = false;
            })
            .catch((data) => {
              this.$scope.loading.checkServiceMigrateable = false;
              if (data.status === 460) {
                this.$scope.migrateableIpError = 'EXPIRED';
              } else {
                this.$scope.migrateableIpError = 'ANOTHER';
                this.Alerter.alertFromSWS(
                  this.$translate.instant('ip_migration_step1_error'),
                  data.data,
                  'otrs_alert_migration',
                );
              }
            });
        })
        .catch((data) => {
          this.$scope.loading.checkServiceMigrateable = false;

          return this.goBack({
            message: {
              text: this.$translate.instant('ip_migration_step2_error'),
              data: {
                ...data,
                type: 'ERROR',
              },
            },
          });
        });
    };

    /*= =============================
    =            STEP 3            =
    ============================== */

    this.$scope.getDurations = () => {
      const queue = [];
      this.$scope.loading.prices = true;

      angular.forEach(this.$scope.durations.available, (duration) => {
        queue.push(
          this.IpDashboardOrderLegacy.getMigrateIpOrder(
            this.$scope.migrate,
            duration,
          ).then((details) => {
            this.$scope.durations.details[duration] = details;
          }),
        );
      });

      this.$q
        .all(queue)
        .then(() => {
          if (
            this.$scope.durations.available &&
            this.$scope.durations.available.length === 1
          ) {
            this.$scope.migrate.duration = head(
              this.$scope.durations.available,
            );
          }
          this.$scope.loading.prices = false;
        })
        .catch((data) =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_migration_step3_error'),
              data: {
                ...data,
                type: 'ERROR',
              },
            },
          }),
        );
    };

    /*= =============================
    =            STEP 4            =
    ============================== */

    this.$scope.loadContracts = () => {
      this.$scope.agree.value = false;
      if (
        !this.$scope.durations.details[this.$scope.migrate.duration]
          .contracts ||
        !this.$scope.durations.details[this.$scope.migrate.duration].contracts
          .length
      ) {
        this.$rootScope.$broadcast('wizard-goToStep', 7);
      }
    };

    this.$scope.backToContracts = () => {
      if (
        !this.$scope.durations.details[this.$scope.migrate.duration]
          .contracts ||
        !this.$scope.durations.details[this.$scope.migrate.duration].contracts
          .length
      ) {
        this.$rootScope.$broadcast('wizard-goToStep', 4);
      }
    };

    /*= =============================
    =            STEP 5            =
    ============================== */

    this.$scope.getResumePrice = (price) => {
      return price.value === 0
        ? this.$translate.instant('price_free')
        : this.$translate.instant('price_ht_label', { t0: price.text });
    };

    this.$scope.migrateIp = () => {
      this.$scope.loading.validation = true;
      this.IpDashboardOrderLegacy.postMigrateIpOrder(this.$scope.migrate)
        .then((order) => {
          window.open(order.url, '_blank');

          return this.goBack(
            {
              message: {
                text: this.$translate.instant('ip_migration_step5_success', {
                  t0: order.url,
                  t1: order.orderId,
                }),
                data: {
                  idTask: order.orderId,
                  state: 'OK',
                  type: 'OK',
                },
              },
            },
            { reload: true },
          );
        })
        .catch((data) =>
          this.goBack({
            message: {
              text: this.$translate.instant('ip_migration_step5_error'),
              data: {
                ...data,
                type: 'ERROR',
              },
            },
          }),
        )
        .finally(() => {
          this.$scope.loading.validation = false;
        });
    };
  }
}
