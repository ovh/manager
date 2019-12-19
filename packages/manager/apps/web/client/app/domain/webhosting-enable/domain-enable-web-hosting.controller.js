import compact from 'lodash/compact';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';

angular.module('App').controller(
  'App.Controllers.EnableWebHostingOrderController',
  class EnableWebHostingOrderCtrl {
    constructor(
      $scope, $q, $translate, $window,
      Alerter, atInternet, Hosting, HostingModule, HostingOrder, User, constants,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$window = $window;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.atInternet = atInternet;
      this.Hosting = Hosting;
      this.HostingModule = HostingModule;
      this.HostingOrder = HostingOrder;
      this.User = User;
      this.constants = constants;
    }

    $onInit() {
      this.dnsZones = [];
      this.domain = angular.copy(this.$scope.currentActionData);
      this.loading = {
        init: true,
        order: false,
      };
      this.model = {
        offer: null,
        dnsZone: 'RESET_ALL',
        duration: '12',
      };
      this.offers = [];
      this.order = null;

      this.$scope.checkModuleForNextStep = () => this.checkModuleForNextStep();
      this.$scope.checkModuleForPreviousStep = () => this.checkModuleForPreviousStep();
      this.$scope.initDnsZone = () => this.initDnsZone();
      this.$scope.loadContracts = () => this.loadContracts();
      this.$scope.orderByOfferPrice = (offer) => this.constructor.orderByOfferPrice(offer);
      this.$scope.orderHosting = () => this.orderHosting();

      if (this.hasPreselectedOffer()) {
        this.model.offer = this.domain.selected.offer;
        this.$scope.$emit('wizard-goToStep', 3);
        this.initDnsZone();
      }

      this.$q
        .all({
          modules: this.model.offer !== this.constants.HOSTING.OFFERS.START_10_M.LIST_VALUE
            ? this.getModulesList() : null,
          offers: this.offers.length ? this.offers : this.getOffersList(),
          user: this.User.getUser(),
        })
        .then(({ modules, offers, user }) => {
          this.model.moduleTemplates = filter(modules, { branch: 'stable' });
          this.offers = compact(offers);
          this.hostingUrl = this.constants.urls.hosting[user.ovhSubsidiary]
            || this.constants.urls.hosting.FR;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('hosting_tab_DATABASES_configuration_create_step1_loading_error'), err, this.$scope.alerts.main);
          this.$scope.resetAction();
        })
        .finally(() => {
          this.loading.init = false;
        });
    }

    initDnsZone() {
      let rtn;
      if (this.model.templateSelected) {
        this.$scope.$emit('wizard-goToStep', 4);
      } else {
        if (this.dnsZones.length > 0) {
          return this.dnsZones;
        }
        rtn = this.HostingOrder
          .getModels()
          .then((models) => {
            this.dnsZones = map(models['hosting.web.DnsZoneEnum'].enum, (item) => ({
              key: item,
              title: `domain_configuration_web_hosting_dns_${item}`,
              helpMsg: `domain_configuration_web_hosting_dns_info_${item}`,
            }));
          })
          .catch((err) => this.Alerter.error(err));
      }
      return rtn;
    }

    getModulesList() {
      return this.HostingModule
        .getModulesLatestList()
        .then((moduleTemplates) => this.$q.all(map(
          moduleTemplates,
          (id) => this.HostingModule.getAvailableModule(id),
        )));
    }

    getOffersList() {
      return this.Hosting
        .getAvailableOffer(this.domain.name)
        .then((offers) => this.$q.all(map(offers, (offer) => {
          let rtn;
          if ((!this.model.offer
              && offer !== this.constants.HOSTING.OFFERS.START_10_M.LIST_VALUE)
              || (this.model.offer
                && offer === this.constants.HOSTING.OFFERS.START_10_M.LIST_VALUE)) {
            rtn = this.HostingOrder.get(
              this.domain.name, offer,
              this.model.dnsZone, this.model.duration,
            ).then((orderInfos) => ({
              offer,
              orderInfos,
            }));
          }
          return rtn;
        })));
    }

    displayRecommendedLabel(offer) {
      const name = get(this.model, 'templateSelected.name', false);
      return name && ((name === 'prestashop' && offer === 'PERFORMANCE_1') || (name !== 'prestashop' && offer === 'PRO'));
    }

    hasPreselectedOffer() {
      return !!get(this.domain, 'selected.offer', false);
    }

    static orderByOfferPrice(a) {
      if (a.offer !== 'START') {
        return a.orderInfos.prices.withTax.value;
      }
      return Number.MAX_VALUE;
    }

    previousButtonHidden() {
      return this.$scope.currentStep < 3 && this.hasPreselectedOffer();
    }

    selectModule(module) {
      if (this.model.templateSelected === module) {
        this.model.templateSelected = null;
      } else {
        this.model.templateSelected = module;
        if (module.name === 'prestashop') {
          this.model.offer = find(this.offers, { offer: 'PERFORMANCE_1' }).offer;
        } else {
          this.model.offer = find(this.offers, { offer: 'PRO' }).offer;
        }
      }
    }

    checkModuleForNextStep() {
      if (this.model.templateSelected) {
        this.$scope.$emit('wizard-goToStep', 3);
      }
    }

    checkModuleForPreviousStep() {
      if (this.model.templateSelected) {
        this.$scope.$emit('wizard-goToStep', 1);
      }
    }

    loadContracts() {
      let rtn;
      if (this.model.templateSelected) {
        // get the contracts for hosting WITH modules
        rtn = this.HostingOrder.get(
          this.domain.name,
          this.model.offer,
          this.model.dnsZone, this.model.duration, this.model.templateSelected.name.toUpperCase(),
        ).then((options) => {
          this.getSelectedOfferOrderInfos().contracts = options.contracts;
          this.getSelectedOfferOrderInfos().details = options.details;
        });
      }
      return rtn;
    }

    getResumePrice(price) {
      // If price value is 0, the price is included, or else we display price
      // Adding sceParameters will tell translator not to sanitize the value and trust as HTML
      return price.value === 0 ? this.$translate.instant('price_free')
        : this.$translate.instant('domain_hosting_price_ht_label', { price: price.text }, undefined, false, 'sceParameters');
    }

    getSelectedOfferOrderInfos() {
      return (find(this.offers, { offer: this.model.offer }) || { orderInfos: {} }).orderInfos;
    }

    orderHosting() {
      this.loading.order = true;
      return this.HostingOrder
        .post(
          this.domain.name,
          this.model.offer,
          this.model.dnsZone,
          this.model.duration,
          this.model.templateSelected ? this.model.templateSelected.name.toUpperCase() : null,
        )
        .then((order) => {
          if (this.getSelectedOfferOrderInfos().prices.withTax.value === 0) {
            this.User.payWithRegisteredPaymentMean({
              orderId: order.orderId,
              paymentMean: 'fidelityAccount',
            });
          }
          this.atInternet.trackOrder({
            name: `[hosting]::${this.model.offer}[${this.model.offer}]`,
            page: 'web::payment-pending',
            orderId: order.orderId,
            priceTaxFree: order.prices.withoutTax.value,
            price: order.prices.withTax.value,
            status: 1,
          });

          this.Alerter.success(this.$translate.instant('domain_order_hosting_finish_success', { t0: order.url }), this.$scope.alerts.main);
          this.$window.open(order.url, '_blank');
          return true;
        })
        .catch((err) => this.Alerter.alertFromSWS(this.$translate.instant('domain_order_hosting_finish_error'), get(err, 'data', err), this.$scope.alerts.main))
        .finally(() => this.$scope.resetAction());
    }
  },
);
