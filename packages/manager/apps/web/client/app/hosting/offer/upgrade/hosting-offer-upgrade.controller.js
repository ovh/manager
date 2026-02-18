import get from 'lodash/get';
import includes from 'lodash/includes';
import {
  DETACH_DEFAULT_OPTIONS,
  OFFERS_WITHOUT_FREEDOM,
  OFFER_UPGRADE_BLOCKING_CONDITIONS,
  OFFER_CATEGORY,
  PERFORMANCE_LEVEL_MAP,
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
      $q,
      Alerter,
      apiTranslator,
      atInternet,
      coreConfig,
      Hosting,
      HostingDatabase,
      OvhHttp,
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
      this.$q = $q;
      this.Alerter = Alerter;
      this.apiTranslator = apiTranslator;
      this.atInternet = atInternet;
      this.coreConfig = coreConfig;
      this.Hosting = Hosting;
      this.HostingDatabase = HostingDatabase;
      this.OvhHttp = OvhHttp;
      this.WucUser = WucUser;
      this.ovhManagerProductOffersActionService = ovhManagerProductOffersActionService;
      this.$anchorScroll = $anchorScroll;

      this.blockingConditions = [];
      this.blockingConditionParams = {};
      this.loadingBlockingCheck = false;
      this.performanceInfo = null;
      this.filteredAvailableOffers = [];
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
          return this.Hosting.getSelected(this.productId)
            .then((hosting) => {
              this.hosting = hosting;
              return this.getAvailableOptions(this.productId);
            })
            .then(() => {
              this.applyPerformanceOfferFilter();
              this.updatePerformanceInfo();
            })
            .catch(() => {
              this.availableOffers = [];
              this.filteredAvailableOffers = [];
            })
            .finally(() => {
              this.loading.availableOffers = false;
            });
        },
      ).then(() => {
        this.$scope.$watch(
          () => this.model.offer,
          (newOffer) => {
            if (newOffer) {
              this.loadingBlockingCheck = true;
              this.blockingConditions = [];
              this.blockingConditionParams = {};
              this.checkBlockingConditions();
            } else {
              this.blockingConditions = [];
              this.blockingConditionParams = {};
            }
          },
        );
      });
    }

    updatePerformanceInfo() {
      if (!this.hosting) return;
      const currentCategory = this.constructor.getOfferCategory(
        this.hosting.offer,
      );
      if (currentCategory !== OFFER_CATEGORY.PERFORMANCE) {
        this.performanceInfo = null;
        return;
      }
      const currentLevel = this.constructor.getPerformanceLevel(
        this.hosting.offer,
      );
      if (!currentLevel) {
        this.performanceInfo = null;
        return;
      }
      const lowerLevel = currentLevel > 1 ? currentLevel - 1 : null;
      const hasHigher = currentLevel < 4;
      const higherLevelsLabel = hasHigher
        ? this.$translate.instant(
            `hosting_order_upgrade_performance_info_higher_${currentLevel}`,
          )
        : null;
      let type = 'both';
      if (!lowerLevel) type = 'up_only';
      else if (!hasHigher) type = 'down_only';
      this.performanceInfo = {
        type,
        currentLevel,
        lowerLevel,
        higherLevelsLabel,
      };
    }

    static getOfferCategory(offerCode) {
      if (!offerCode) return null;
      const code = typeof offerCode === 'string' ? offerCode.toLowerCase() : '';
      if (includes(code, 'perf') || includes(code, 'performance')) {
        return OFFER_CATEGORY.PERFORMANCE;
      }
      if (includes(code, 'pro')) return OFFER_CATEGORY.PRO;
      if (includes(code, 'perso')) return OFFER_CATEGORY.PERSO;
      return null;
    }

    static getPerformanceLevel(offerCode) {
      if (!offerCode) return null;
      const direct = PERFORMANCE_LEVEL_MAP[offerCode];
      if (direct != null) return direct;
      const normalized = String(offerCode).toLowerCase().replace(/-/g, '_');
      const normalizedMap = PERFORMANCE_LEVEL_MAP[normalized];
      if (normalizedMap != null) return normalizedMap;
      const match = String(offerCode).match(
        /perf[^0-9]*([1-4])|performance[^0-9]*([1-4])/i,
      );
      return match ? parseInt(match[1] || match[2], 10) : null;
    }

    isPerformanceOfferValidForTransition(offerPlanCode) {
      const currentCategory = this.constructor.getOfferCategory(
        this.hosting?.offer,
      );
      if (currentCategory !== OFFER_CATEGORY.PERFORMANCE) return true;
      const currentLevel = this.constructor.getPerformanceLevel(
        this.hosting?.offer,
      );
      if (!currentLevel) return true;
      const targetLevel = this.constructor.getPerformanceLevel(offerPlanCode);
      if (targetLevel == null) return false;
      return targetLevel === currentLevel - 1 || targetLevel > currentLevel;
    }

    applyPerformanceOfferFilter() {
      if (!this.availableOffers || !Array.isArray(this.availableOffers)) {
        this.filteredAvailableOffers = this.availableOffers || [];
        return;
      }
      this.filteredAvailableOffers = this.availableOffers.filter((offer) => {
        const planCode =
          typeof offer === 'string' ? offer : get(offer, 'planCode');
        return (
          !planCode || this.isPerformanceOfferValidForTransition(planCode)
        );
      });
    }

    hasBlockingCondition(condition) {
      return (
        this.blockingConditions &&
        this.blockingConditions.indexOf(condition) !== -1
      );
    }

    getBlockingParam(condition, key) {
      const params = get(this.blockingConditionParams, condition);
      return params ? get(params, key) : null;
    }

    isPotentiallyBlockingTransition() {
      if (!this.model.offer || !this.hosting) return false;
      const currentCategory = this.constructor.getOfferCategory(
        this.hosting.offer,
      );
      const targetCategory = this.constructor.getOfferCategory(
        this.model.offer.planCode,
      );
      return (
        (currentCategory === OFFER_CATEGORY.PRO ||
          currentCategory === OFFER_CATEGORY.PERFORMANCE) &&
        targetCategory === OFFER_CATEGORY.PERSO
      );
    }

    checkBlockingConditions() {
      if (!this.model.offer || !this.hosting) return;

      const currentCategory = this.constructor.getOfferCategory(
        this.hosting.offer,
      );
      const targetPlanCode = this.model.offer.planCode;
      const targetCategory = this.constructor.getOfferCategory(targetPlanCode);
      const currentPerfLevel = this.constructor.getPerformanceLevel(
        this.hosting.offer,
      );
      const targetPerfLevel = this.constructor.getPerformanceLevel(targetPlanCode);

      const serviceName = get(
        this.hosting,
        'serviceName',
        this.$stateParams.productId,
      );

      this.loadBlockingData(serviceName)
        .then((data) => {
          const conditions = [];
          const params = {};

          if (
            currentCategory === OFFER_CATEGORY.PERFORMANCE &&
            targetCategory === OFFER_CATEGORY.PRO &&
            data.hasCloudDb
          ) {
            conditions.push(
              OFFER_UPGRADE_BLOCKING_CONDITIONS.CLOUDDB_PERFORMANCE_TO_PRO,
            );
          }
          if (
            currentCategory === OFFER_CATEGORY.PRO &&
            targetCategory === OFFER_CATEGORY.PERSO &&
            data.databasesCount > 1
          ) {
            conditions.push(
              OFFER_UPGRADE_BLOCKING_CONDITIONS.DATABASES_PRO_TO_PERSO,
            );
            params[OFFER_UPGRADE_BLOCKING_CONDITIONS.DATABASES_PRO_TO_PERSO] = {
              count: data.databasesCount,
            };
          }
          if (
            currentCategory === OFFER_CATEGORY.PRO &&
            targetCategory === OFFER_CATEGORY.PERSO &&
            data.ftpUsersCount > 1
          ) {
            conditions.push(
              OFFER_UPGRADE_BLOCKING_CONDITIONS.FTP_USERS_PRO_TO_PERSO,
            );
          }
          if (
            currentCategory === OFFER_CATEGORY.PERFORMANCE &&
            targetCategory === OFFER_CATEGORY.PERFORMANCE &&
            currentPerfLevel != null &&
            targetPerfLevel != null &&
            targetPerfLevel < currentPerfLevel - 1
          ) {
            const lowerLevel = currentPerfLevel - 1;
            conditions.push(
              OFFER_UPGRADE_BLOCKING_CONDITIONS.PERFORMANCE_DOWNGRADE_TOO_LOW,
            );
            params[
              OFFER_UPGRADE_BLOCKING_CONDITIONS.PERFORMANCE_DOWNGRADE_TOO_LOW
            ] = { lowerLevel };
          }
          if (
            (currentCategory === OFFER_CATEGORY.PRO ||
              currentCategory === OFFER_CATEGORY.PERFORMANCE) &&
            targetCategory === OFFER_CATEGORY.PERSO &&
            data.mailingListsCount > 0
          ) {
            conditions.push(
              OFFER_UPGRADE_BLOCKING_CONDITIONS.MAILING_LISTS_TO_PERSO,
            );
          }

          this.blockingConditions = conditions;
          this.blockingConditionParams = params;
        })
        .catch(() => {
          this.blockingConditions = [];
        })
        .finally(() => {
          this.loadingBlockingCheck = false;
        });
    }

    loadBlockingData(serviceName) {
      const data = {
        hasCloudDb: false,
        databasesCount: 0,
        ftpUsersCount: 0,
        mailingListsCount: 0,
      };

      const promises = [];

      promises.push(
        this.HostingDatabase.getPrivateDatabaseIds(serviceName)
          .then((ids) => {
            data.hasCloudDb = ids && ids.length > 0;
          })
          .catch(() => {}),
      );

      promises.push(
        this.HostingDatabase.databaseList(serviceName)
          .then((dbs) => {
            data.databasesCount = Array.isArray(dbs) ? dbs.length : 0;
          })
          .catch(() => {}),
      );

      promises.push(
        this.Hosting.getTabFTP(serviceName, 0, 100, true)
          .then((ftp) => {
            const count = get(ftp, 'list.results.length', 0);
            data.ftpUsersCount = count;
          })
          .catch(() => {}),
      );

      promises.push(
        this.Hosting.getEmailOptions(serviceName)
          .then((options) => {
            if (!options || options.length === 0) return this.$q.resolve();
            return this.$q.all(
              options.map((opt) => {
                const domain = get(opt, 'domain');
                if (!domain) return this.$q.resolve();
                return this.OvhHttp.get(
                  `/email/domain/${domain}/mailingList`,
                  { rootPath: 'apiv6' },
                )
                  .then((lists) => {
                    data.mailingListsCount += Array.isArray(lists)
                      ? lists.length
                      : 0;
                  })
                  .catch(() => {});
              }),
            );
          })
          .catch(() => {}),
      );

      return this.$q.all(promises).then(() => data);
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
      ).catch((error) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_order_upgrade_error'),
          this.apiTranslator.translate(error),
          this.$scope.alerts.page,
        );
        this.$anchorScroll('topWebUniverse');
      });
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
        .then((data) => ({ data }));
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
          this.durations = durations.order
            ? durations
            : { order: durations.shift() };
          this.model.duration = this.durations;
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
        .then(({ data: { order } }) => {
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

    hasFreedom() {
      return !OFFERS_WITHOUT_FREEDOM.includes(this.hosting.offer);
    }

    static formatExpirationDate(date) {
      return `upto-${date.split('T')[0]}`;
    }
  },
);
