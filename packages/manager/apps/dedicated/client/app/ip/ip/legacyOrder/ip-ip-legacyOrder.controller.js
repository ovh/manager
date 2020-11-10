import get from 'lodash/get';
import has from 'lodash/has';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';

angular.module('Module.ip.controllers').controller(
  'IpLegacyOrderCtrl',
  class {
    constructor(
      $q,
      $rootScope,
      $state,
      $scope,
      $translate,
      $window,
      Alerter,
      constants,
      DedicatedCloud,
      Ip,
      IpAgoraOrder,
      IpLegacyOrder,
      IpOrganisation,
      User,
    ) {
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$scope = $scope;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.constants = constants;
      this.DedicatedCloud = DedicatedCloud;
      this.Ip = Ip;
      this.IpAgoraOrder = IpAgoraOrder;
      this.IpLegacyOrder = IpLegacyOrder;
      this.IpOrganisation = IpOrganisation;
      this.User = User;
    }

    $onInit() {
      this.alertId = 'ip_order_alert';

      this.$scope.model = {};
      this.$scope.user = {};
      this.$scope.agree = {
        value: false,
      };

      this.$scope.loading = {};

      this.$scope.getServices = () => this.getServices();
      this.$scope.canServiceBeOrdered = () => this.canServiceBeOrdered();
      this.$scope.loadOrderForm = () => this.loadOrderForm();
      this.$scope.isMonthlyVps = () => this.isMonthlyVps();
      this.$scope.orderFormValid = () => this.orderFormValid();
      this.$scope.checkDedicatedBlockSize = () =>
        this.checkDedicatedBlockSize();
      this.$scope.orderOrganisation = () => this.orderOrganisation();
      this.$scope.loadPrices = (durations) => this.loadPrices(durations);
      this.$scope.getDurations = () => this.getDurations();
      this.$scope.loadContracts = () => this.loadContracts();
      this.$scope.backToContracts = () => this.backToContracts();
      this.$scope.getResumePrice = (price) => this.getResumePrice(price);
      this.$scope.confirmOrder = () => this.confirmOrder();

      if (this.isOrderingFromDrp()) {
        this.$scope.closeModal = () => this.$state.go('^');
      } else {
        this.$scope.closeModal = this.$scope.resetAction;
      }
    }

    isOrderingFromDrp() {
      return (
        startsWith(
          this.$state.current.name,
          'app.dedicatedClouds.datacenter.drp',
        ) ||
        startsWith(
          this.$state.current.name,
          'app.managedBaremetal.datacenter.drp',
        )
      );
    }

    /*= =============================
    =            STEP 1            =
    ============================== */

    getServices() {
      this.$scope.loading.services = true;

      return this.$q
        .all({
          servicesList: this.IpLegacyOrder.getServicesByType(),
          user: this.User.getUser(),
        })
        .then((results) => {
          this.$scope.servicesList = results.servicesList;
          this.$scope.user = results.user;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_order_loading_error'),
            err,
          );
        })
        .finally(() => {
          this.$scope.loading.services = false;
        });
    }

    canServiceBeOrdered() {
      this.$scope.loading.serviceCanBeOrdered = true;
      this.$scope.orderableIp = null;
      this.$scope.orderableIpError = null;

      // First, check if option can be ordered
      return this.IpLegacyOrder.checkIfAllowed(this.$scope.model.service, 'ip')
        .then((serviceAllowed) => {
          if (!serviceAllowed) {
            this.$scope.orderableIpError = 'OPTION_NOT_ALLOWED';
            return { serviceIsAllowed: false };
          }

          return this.IpLegacyOrder.getServiceOrderableIp(
            this.$scope.model.service,
          );
        })
        .then((infos) => {
          if (!infos) {
            this.$scope.orderableIpError = 'OUT';
            return null;
          }

          if (get(infos, 'vpsInfos.model.version') === '2019v1') {
            return this.$state.go('app.ip.agora-order', {
              service: this.$scope.model.service,
              user: this.$scope.currentUser,
            });
          }

          if (has(infos, 'serviceIsAllowed')) {
            return null;
          }

          const hasIPv4 = isArray(infos.ipv4) && !isEmpty(infos.ipv4);
          const hasIPv6 = isArray(infos.ipv6) && !isEmpty(infos.ipv6);

          if (
            this.$scope.model.service.serviceType === 'DEDICATED' &&
            !(hasIPv4 || hasIPv6)
          ) {
            this.$scope.orderableIpError = 'OPTION_NOT_ALLOWED';
            return null;
          }

          this.$scope.orderableIp = infos;

          if (this.$scope.model.service.serviceType === 'PCC') {
            return this.DedicatedCloud.getDescription(
              this.$scope.model.service.serviceName,
            ).then(({ generation, productReference, servicePackName }) => {
              this.$scope.model.service.usesLegacyOrder = generation !== '2.0';
              this.$scope.model.service.servicePackName = servicePackName;
              this.$scope.model.service.productReference = productReference;
            });
          }

          return null;
        })
        .catch((data) => {
          if (data.status === 460) {
            this.$scope.orderableIpError = 'EXPIRED';
          } else {
            this.Alerter.alertFromSWS(
              this.$translate.instant('ip_order_loading_error'),
              data.data,
            );
          }
        })
        .finally(() => {
          this.$scope.loading.serviceCanBeOrdered = false;
        });
    }

    /* ==============================
    =            STEP 2            =
    ============================== */

    loadOrderForm() {
      const queue = [];
      this.$scope.loading.form = true;

      // Reset model params!
      this.$scope.model.params = {};

      if (this.$scope.model.service.serviceType === 'DEDICATED') {
        this.$scope.model.params.type = 'failover';
      }

      queue.push(
        this.IpLegacyOrder.getAvailableCountries(this.$scope.model.service)
          .then((countries) => {
            this.$scope.orderableIp.countries = countries.map(
              (countryCode) => ({
                code: countryCode,
                displayValue: this.$translate.instant(
                  `country_${countryCode.toUpperCase()}`,
                ),
              }),
            );
          })
          .catch((error) => {
            if (
              this.$scope.model.service.serviceType === 'PCC' &&
              !this.$scope.model.service.usesLegacyOrder
            ) {
              return null;
            }

            return this.$q.reject(error);
          }),
      );

      if (this.$scope.model.service.serviceType === 'PCC') {
        queue.push(
          this.Ip.getOrderModels().then((models) => {
            this.$scope.orderableIp.size =
              models['dedicatedCloud.OrderableIpBlockRangeEnum'].enum;
          }),
        );
      } else if (this.$scope.model.service.serviceType === 'DEDICATED') {
        // Check if it is a BHS server
        queue.push(
          this.IpLegacyOrder.checkIfCanadianServer(
            this.$scope.model.service.serviceName,
          ).then((isCanadianServer) => {
            this.$scope.orderableIp.isCanadianServer = isCanadianServer;
          }),
        );

        queue.push(
          this.IpOrganisation.getIpOrganisation().then((organisations) => {
            this.$scope.orderableIp.ipOrganisation = organisations;
          }),
        );
      }

      return this.$q
        .all(queue)
        .then(() => {
          this.$scope.loading.form = false;
        })
        .catch((data) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_order_loading_error'),
            get(data, 'data', data),
          );
          this.$scope.loading.form = false;
        });
    }

    isMonthlyVps() {
      return this.$scope.model.service.serviceType === 'VPS'
        ? this.$scope.orderableIp &&
            this.$scope.orderableIp.vpsInfos.model &&
            this.$scope.orderableIp.vpsInfos.model.version !== '2015v1'
        : false;
    }

    orderFormValid() {
      if (
        !this.$scope.orderableIp ||
        !this.$scope.model.service ||
        !this.$scope.model.service.serviceType ||
        !this.$scope.model.params
      ) {
        return false;
      }

      switch (this.$scope.model.service.serviceType) {
        case 'DEDICATED':
          if (
            !this.$scope.model.params.blockSize ||
            (this.$scope.orderableIp.isCanadianServer
              ? this.$scope.model.params.blockSize === 1 &&
                !this.$scope.model.params.country
              : !this.$scope.model.params.country)
          ) {
            return false;
          }

          if (
            this.$scope.model.params.blockSize > 1 &&
            !this.$scope.orderableIp.isCanadianServer
          ) {
            // No orga in CA
            return !!this.$scope.model.params.organisationId;
          }

          return true;
        case 'PCC':
          if (this.$scope.model.service.usesLegacyOrder) {
            return (
              this.$scope.model.params.size &&
              this.$scope.model.params.country &&
              this.$scope.model.params.networkName &&
              /^[a-zA-Z]+\w+$/.test(this.$scope.model.params.networkName) &&
              this.$scope.model.params.estimatedClientsNumber &&
              this.$scope.model.params.description &&
              this.$scope.model.params.usage
            );
          }

          return (
            this.$scope.model.params.size &&
            this.$scope.model.params.country &&
            this.$scope.model.params.networkName &&
            /^[a-zA-Z]+\w+$/.test(this.$scope.model.params.networkName) &&
            this.$scope.model.params.description
          );
        case 'VPS':
          return (
            this.$scope.model.params.country && this.$scope.model.params.number
          );
        default:
          return null;
      }
    }

    checkDedicatedBlockSize() {
      if (
        this.$scope.model.params &&
        this.$scope.model.params.blockSize === 1
      ) {
        delete this.$scope.model.params.organisationId;
      }
    }

    orderOrganisation() {
      this.$rootScope.$broadcast('ips.display', 'organisation');
      this.$scope.resetAction();
    }

    /*= =============================
    =            STEP 3            =
    ============================== */

    loadPrices(durations) {
      this.$scope.loading.prices = true;

      const queue = durations.map((duration) =>
        this.IpLegacyOrder.getOrderForDuration(
          this.$scope.model.service,
          this.$scope.model.params,
          duration,
        ).then((details) => {
          this.$scope.durations.details[duration] = details;
        }),
      );

      return this.$q.all(queue).then(() => {
        if (durations && durations.length === 1) {
          this.$scope.model.duration = head(durations);
        }

        this.$scope.loading.prices = false;
      });
    }

    getDurations() {
      const queue = [];
      let needProfessionalUse = false;
      this.Alerter.resetMessage(this.alertId);

      this.$scope.durations = {
        available: null,
        details: {},
      };

      this.$scope.model.duration = null;
      this.$scope.orderableIp.professionalUsePrice = null;
      this.$scope.loading.durations = true;

      if (
        this.$scope.orderableIp.isCanadianServer &&
        this.$scope.model.params.blockSize > 1
      ) {
        this.$scope.model.params.country =
          head(this.$scope.orderableIp.countries).code || 'ca'; // Forced :'( ...
      }

      if (
        this.$scope.model.service.serviceType === 'PCC' &&
        !this.$scope.model.service.usesLegacyOrder
      ) {
        queue.push(
          this.IpAgoraOrder.fetchPrices(
            this.$scope.model.service.serviceName,
            this.$scope.model.params.size,
          ).then((prices) => {
            this.$scope.durations.available = map(prices, 'duration');
            this.$scope.durations.details = prices.reduce(
              (accumulator, currentValue) => ({
                ...accumulator,
                [currentValue.duration]: {
                  ...currentValue,
                  details: [
                    {},
                    {
                      planCode: currentValue.planCode,
                      totalPrice: {
                        value: 0,
                      },
                    },
                  ],
                },
              }),
              {},
            );
          }),
        );
      } else {
        queue.push(
          this.IpLegacyOrder.getOrder(
            this.$scope.model.service,
            this.$scope.model.params,
          ).then((durations) => {
            this.$scope.durations.available = durations;
            this.loadPrices(durations);
          }),
        );
      }

      if (this.$scope.model.service.serviceType === 'DEDICATED') {
        angular.forEach(this.$scope.orderableIp.ipv4, (ip) => {
          if (
            ip.blockSizes &&
            ip.blockSizes.length &&
            ~ip.blockSizes.indexOf(this.$scope.model.params.blockSize) &&
            ip.optionRequired === 'professionalUse'
          ) {
            needProfessionalUse = true;
          }
        });

        if (needProfessionalUse) {
          queue.push(
            this.IpLegacyOrder.getProfessionalUsePrice(
              this.$scope.model.service.serviceName,
            ).then((price) => {
              this.$scope.orderableIp.professionalUsePrice = price;
            }),
          );
        }
      }

      return this.$q
        .all(queue)
        .then(() => {
          this.$scope.loading.durations = false;
        })
        .catch((err) => {
          this.Alerter.error(
            this.$translate.instant('ip_order_loading_error2', {
              t0: err.data ? err.data.message : err.message,
            }),
            this.alertId,
          );

          this.$scope.loading.durations = false;
        });
    }

    /*= =============================
    =            STEP 4            =
    ============================== */

    getDrpState() {
      return this.$scope.model.service.productReference === 'MBM'
        ? 'app.managedBaremetal.datacenter.drp'
        : 'app.dedicatedClouds.datacenter.drp';
    }

    loadContracts() {
      this.$scope.agree.value = false;

      if (
        !this.$scope.durations.details[this.$scope.model.duration].contracts ||
        !this.$scope.durations.details[this.$scope.model.duration].contracts
          .length
      ) {
        this.$rootScope.$broadcast('wizard-goToStep', 6);
      }
    }

    backToContracts() {
      if (
        !this.$scope.durations.details[this.$scope.model.duration].contracts ||
        !this.$scope.durations.details[this.$scope.model.duration].contracts
          .length
      ) {
        this.$rootScope.$broadcast('wizard-goToStep', 3);
      }
    }

    /*= =============================
    =            STEP 5            =
    ============================== */

    getResumePrice(price) {
      return price.value === 0
        ? this.$translate.instant('price_free')
        : this.$translate.instant('price_ht_label', { t0: price.text });
    }

    redirectToPaymentPage() {
      const productToOrder = this.IpAgoraOrder.constructor.createProductToOrder(
        {
          country: this.$scope.model.params.country,
          description: this.$scope.model.params.description,
          destination: this.$scope.model.service.serviceName,
          planCode: this.$scope.durations.details[this.$scope.model.duration]
            .planCode,
          pricingMode: `pcc-servicepack-${this.$scope.model.service.servicePackName}`,
          productId: 'privateCloud',
          netname: this.$scope.model.params.networkName,
          serviceName: this.$scope.model.service.serviceName,
        },
      );

      return this.User.getUrlOf('express_order')
        .then((url) => {
          this.$window.open(
            `${url}review?products=${JSURL.stringify([productToOrder])}`,
            '_blank',
          );
        })
        .catch((data) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_order_finish_error'),
            data.data,
          );
        })
        .finally(() =>
          this.isOrderingFromDrp()
            ? this.$scope.closeModal().then(() =>
                this.$state.go(this.getDrpState(), {
                  reload: true,
                }),
              )
            : this.$scope.closeModal(),
        );
    }

    confirmOrder() {
      if (
        this.$scope.model.service.serviceType === 'PCC' &&
        !this.$scope.model.service.usesLegacyOrder
      ) {
        return this.redirectToPaymentPage();
      }

      return this.confirmLegacyOrder();
    }

    confirmLegacyOrder() {
      this.$scope.loading.validation = true;

      return this.IpLegacyOrder.postOrder(
        this.$scope.model.service,
        this.$scope.model.params,
        this.$scope.model.duration,
      )
        .then((order) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_order_finish_success', {
              t0: order.url,
              t1: order.orderId,
            }),
            { idTask: order.orderId, state: 'OK' },
          );

          this.$window.open(order.url, '_blank');
        })
        .catch((data) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('ip_order_finish_error'),
            data.data,
          );
        })
        .finally(() =>
          this.isOrderingFromDrp()
            ? this.$scope.closeModal().then(() =>
                this.$state.go(this.getDrpState(), {
                  reload: true,
                }),
              )
            : this.$scope.closeModal(),
        );
    }
  },
);
