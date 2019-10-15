import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($q, $translate, $window, HostingOptionOrder, Alerter) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;
    this.HostingOptionOrder = HostingOptionOrder;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.loading = true;

    this.model = {};
    this.durations = [];
    this.details = {};

    this.submitText = this.isOptionFree
      ? this.$translate.instant('hosting_cdn_order_submit_activate')
      : this.$translate.instant('hosting_cdn_order_submit_pay');

    [this.model.offer] = this.availableOffers;
    this.getDuration();
  }

  getDuration() {
    const queue = [];
    this.loading = true;

    this.HostingOptionOrder.getOrderDurations('cdn', {
      offer: get(this.model, 'offer.value'),
    })
      .then((durations) => {
        this.durations = durations;

        if (this.durations.length === 1) {
          [this.model.duration] = this.durations;
        }

        angular.forEach(this.durations, (duration) => {
          queue.push(this.HostingOptionOrder.getOrderDetailsForDuration('cdn', duration, {
            offer: get(this.model, 'offer.value'),
          }).then((details) => {
            this.details[duration] = details;
          }));
        });

        this.$q.all(queue);
      })
      .catch(error => this.goBack(
        this.$translate.instant('hosting_dashboard_cdn_order_error', { message: get(error, 'data.message') }),
        'danger',
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  makeOrder() {
    this.loading = true;
    this.HostingOptionOrder.makeOrder('cdn', this.model.duration, {
      offer: get(this.model, 'offer.value'),
    })
      .then((order) => {
        this.$window.open(order.url, '_blank');
        this.goBack(
          this.$translate.instant('hosting_dashboard_cdn_order_success', { t0: order.url }),
        );
      })
      .catch(error => this.goBack(
        this.$translate.instant('hosting_dashboard_cdn_order_error', { message: get(error, 'data.message') }),
        'danger',
      ));
  }
}
