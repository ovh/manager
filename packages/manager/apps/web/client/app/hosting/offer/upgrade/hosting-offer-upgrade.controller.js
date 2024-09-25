import get from 'lodash/get';
import {
  DETACH_DEFAULT_OPTIONS,
  OFFERS_WITHOUT_FREEDOM,
} from './hosting-offer-upgrade.constants';
import { HOSTING_TRACKING } from '../../hosting.constants';

angular.module('App').controller(
  'HostingUpgradeOfferCtrl',
  class HostingUpgradeOfferCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $rootScope,
      $state,
      $stateParams,
      $translate,
      $window,
      Alerter,
      apiTranslator,
      atInternet,
      coreConfig,
      Hosting,
      WucUser,
      ovhManagerProductOffersActionService,
      $anchorScroll,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.apiTranslator = apiTranslator;
      this.atInternet = atInternet;
      this.coreConfig = coreConfig;
      this.Hosting = Hosting;
      this.WucUser = WucUser;
      this.ovhManagerProductOffersActionService = ovhManagerProductOffersActionService;
      this.$anchorScroll = $anchorScroll;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;
      this.serviceId = null;
      this.isDetachable = false;

      this.availableOffers = [];
      this.durations = null;
      this.loading = {
        availableOffers: true,
        durations: false,
        validation: false,
      };
      this.model = {
        offer: null,
        startTime: '12:00',
        duration: null,
        agree: false,
        downgradeAgree: false,
      };

      const user = this.coreConfig.getUser();
      this.Hosting.getCatalog(user.ovhSubsidiary).then((catalog) => {
        this.user = user;
        this.catalog = catalog;
        this.ovhSubsidiary = user.ovhSubsidiary;
      });

      return this.Hosting.isServiceDetachable(this.productId).then(
        (isDetachable) => {
          this.isDetachable = isDetachable;
          this.Hosting.getSelected(this.productId)
            .then((hosting) => {
              this.hosting = hosting;
              return this.getAvailableOptions(this.productId);
            })
            .catch(() => {
              this.availableOffers = [];
            })
            .finally(() => {
              this.loading.availableOffers = false;
            });
        },
      );
    }

    getAvailableOptions(productId) {
      if (this.isDetachable) {
        return this.Hosting.getServiceInfos(productId)
          .then(({ serviceId }) => {
            this.serviceId = serviceId;
            return this.ovhManagerProductOffersActionService.getAvailableDetachPlancodes(
              serviceId,
            );
          })
          .then((availableOffers) => {
            this.availableOffers = availableOffers;
          });
      }

      return this.Hosting.getAvailableOffer(this.productId).then(
        (availableOffers) => {
          const availableOffersFormatted = availableOffers.map((offer) =>
            offer.toLowerCase().replace(/_/g, ''),
          );

          const catalogProducts = this.catalog.plans.filter(({ planCode }) =>
            availableOffersFormatted.includes(planCode),
          );

          this.availableOffers = availableOffersFormatted.flatMap(
            (offers) =>
              catalogProducts.find(({ planCode }) => offers === planCode) || [],
          );
        },
      );
    }

    getDetachRequestOptions(serviceId, planCode) {
      return this.ovhManagerProductOffersActionService
        .getDetachPlancodeInformationOptions(serviceId, planCode)
        .then((data) => {
          const addons = data.map((e) => ({
            duration: DETACH_DEFAULT_OPTIONS.durationCode,
            planCode: e.plans[0].planCode,
            pricingMode: DETACH_DEFAULT_OPTIONS.pricingMode,
            quantity: DETACH_DEFAULT_OPTIONS.quantity,
            serviceId: e.serviceId,
          }));

          return {
            addons,
            duration: DETACH_DEFAULT_OPTIONS.durationCode,
            pricingMode: DETACH_DEFAULT_OPTIONS.pricingMode,
            quantity: DETACH_DEFAULT_OPTIONS.quantity,
          };
        });
    }

    getDetachPrices(serviceId, planCode) {
      return this.getDetachRequestOptions(serviceId, planCode)
        .then((detachOptions) => {
          return this.ovhManagerProductOffersActionService.simulate(
            planCode,
            serviceId,
            DETACH_DEFAULT_OPTIONS.type,
            detachOptions,
          );
        })
        .then((data) => {
          return [
            {
              ...data.order,
              duration: DETACH_DEFAULT_OPTIONS.durationText,
            },
          ];
        });
    }

    getPrices() {
      if (this.isDetachable) {
        return this.getDetachPrices(this.serviceId, this.model.offer.planCode);
      }

      return this.Hosting.getUpgradePrices(
        get(this.hosting, 'serviceName', this.$stateParams.productId),
        this.model.offer.planCode,
      );
    }

    executeDetachOrder(serviceId, planCode) {
      return this.getDetachRequestOptions(serviceId, planCode)
        .then((detachOptions) => {
          return this.ovhManagerProductOffersActionService.execute(
            planCode,
            serviceId,
            DETACH_DEFAULT_OPTIONS.type,
            detachOptions,
          );
        })
        .then((data) => {
          return data.order;
        });
    }

    executeOrder() {
      if (this.isDetachable) {
        return this.executeDetachOrder(
          this.serviceId,
          this.model.offer.planCode,
        );
      }

      const startTime = moment(this.model.startTime, 'HH:mm:ss')
        .utc()
        .format('HH:mm:ss');

      return this.Hosting.orderUpgrade(
        get(this.hosting, 'serviceName', this.$stateParams.productId),
        this.model.offer.planCode,
        this.model.duration.duration,
        this.hosting.isCloudWeb ? startTime : null,
      );
    }

    getDurations() {
      this.durations = {
        available: [],
        details: {},
      };
      this.loading.durations = true;

      return this.getPrices()
        .then((durations) => {
          this.durations.available = durations;
          if (durations.length === 1) {
            [this.model.duration] = this.durations.available;
          }
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_order_upgrade_error'),
            this.apiTranslator.translate(err),
            this.$scope.alerts.page,
          );
          this.$anchorScroll('topWebUniverse');
          this.$state.go('^');
        })
        .finally(() => {
          this.loading.durations = false;
        });
    }

    formatTime(startTime) {
      const now = moment();
      const time = moment(startTime, 'HH:mm:ss');
      const isToday = time.diff(now) > 0;

      return this.$translate.instant(
        isToday
          ? 'hosting_order_upgrade_start_time_summary_today'
          : 'hosting_order_upgrade_start_time_summary_tomorrow',
        { time: time.format('LT (UTCZ)') },
      );
    }

    formatPrice(price) {
      return price.value === 0
        ? this.$translate.instant('price_free')
        : this.$translate.instant('price_ht_label', { price: price.text });
    }

    orderUpgrade() {
      this.atInternet.trackClick({
        name: 'web::hosting::upgrade::confirm',
        type: 'action',
      });
      this.loading.validation = true;

      const win = this.$window.open('', '_blank');
      win.referrer = null;
      win.opener = null;

      return this.executeOrder()
        .then((order) => {
          this.Alerter.success(
            this.$translate.instant('hosting_order_upgrade_success', {
              t0: order.url,
              t1: order.orderId,
            }),
            this.$scope.alerts.page,
          );
          win.location = order.url;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('hosting_order_upgrade_error'),
            err,
            this.$scope.alerts.page,
          );
          win.close();
        })
        .finally(() => {
          this.loading.validation = false;
          this.$state.go('^');
        });
    }

    trackClick(hit) {
      return this.atInternet.trackClick({
        name: hit,
        type: 'action',
      });
    }

    trackOffer(groupOffer, versionOffer) {
      const { value } = groupOffer.selectedVersion;

      if (versionOffer) {
        this.trackClick(
          `${HOSTING_TRACKING.STEP_1.SELECT_OFFER_LIST}${groupOffer.category}`,
        );
      }

      this.trackClick(`${HOSTING_TRACKING.STEP_1.SELECT_OFFER}${value}`);
    }

    onHostingGroupOfferClick(groupOffer, versionOffer) {
      this.model.offer = groupOffer.selectedVersion;

      this.trackOffer(groupOffer, versionOffer);
    }

    onOfferNextStepClick() {
      this.trackClick(HOSTING_TRACKING.STEP_1.GO_TO_NEXT_STEP);
    }

    onPreviousPageClick() {
      this.trackClick(HOSTING_TRACKING.STEP_1.GO_TO_PREVIOUS_PAGE);

      return this.$state.go('^');
    }

    static isProrataDuration({ duration }) {
      return /^upto/.test(duration);
    }

    hasFreedom() {
      return !OFFERS_WITHOUT_FREEDOM.includes(this.hosting.offer);
    }
  },
);
