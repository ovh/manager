import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($scope, $rootScope, $q, $translate, $window, HostingOptionOrder, Hosting, Alerter) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.HostingOptionOrder = HostingOptionOrder;
    this.Hosting = Hosting;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = {
      init: true,
      duration: true,
      model: false,
      details: false,
      order: false,
    };

    this.model = {
      offer: null,
      duration: null,
      contract: null,
    };

    this.isOrderable = false;
    this.availableOffers = [];
    this.durations = [];
    this.details = {};
  }

  loadOrder() {
    this.loading.init = true;
    this.HostingOptionOrder.isOptionOrderable('cdn').then((isOrderable) => {
      if (isOrderable) {
        this.isOrderable = true;
      }
      this.loading.model = true;
      this.HostingOptionOrder.getOrderEnums('hosting.web.CdnOfferEnum').then((models) => {
        if (!this.isPerfOffer() && !this.hosting.isCloudWeb) {
          this.availableOffers = models.filter(offer => offer !== 'CDN_BUSINESS_FREE');
        } else {
          this.availableOffers = ['CDN_BUSINESS_FREE'];
        }

        [this.model.offer] = this.availableOffers;
        this.loading.model = false;
        this.loading.init = false;

        if (this.availableOffers.length === 1) {
          this.$rootScope.$broadcast('wizard-goToStep', 3);
          this.getDuration();
        }
      });
    });
  }

  getDuration() {
    const queue = [];
    this.loading.duration = true;

    this.HostingOptionOrder.getOrderDurations('cdn', {
      offer: this.model.offer,
    })
      .then((durations) => {
        this.durations = durations;

        if (this.durations.length === 1) {
          [this.model.duration] = this.durations;
        }

        this.loading.details = true;
        angular.forEach(this.durations, (duration) => {
          queue.push(this.HostingOptionOrder.getOrderDetailsForDuration('cdn', duration, {
            offer: this.model.offer,
          }).then((details) => {
            this.details[duration] = details;
          }));
        });
        this.$q.all(queue).then(() => {
          this.loading.details = false;
        });
        this.loading.duration = false;
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_dashboard_cdn_order_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
        this.goBack();
      });
  }

  isStepValid(step) {
    switch (step) {
      case 1:
        return (
          !this.loading.init && this.isOrderable && this.model.offer
        );
      case 2:
        return (
          this.model.offer
          && this.model.duration
          && !this.loading.details
        );
      case 3:
        return (
          this.model.offer
          && this.model.duration
          && this.model.contract
        );
      default:
        return null;
    }
  }

  makeOrder() {
    this.loading.order = true;
    this.HostingOptionOrder.makeOrder('cdn', this.model.duration, {
      offer: this.model.offer,
    })
      .then((order) => {
        this.Alerter.success(
          this.$translate.instant('hosting_dashboard_cdn_order_success', { t0: order.url }),
          this.$scope.alerts.main,
        );
        this.$window.open(order.url, '_blank');
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('hosting_dashboard_cdn_order_error'),
          get(err, 'data', err),
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.goBack();
      });
  }
}
