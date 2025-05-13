import head from 'lodash/head';
import isEmpty from 'lodash/isEmpty';

export default class {
  /* @ngInject */
  constructor($q, $rootScope, $translate, $window, DedicatedCloud, User) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.$window = $window;
    this.DedicatedCloud = DedicatedCloud;
    this.User = User;
  }

  $onInit() {
    this.model = {
      capacity: null,
      duration: null,
    };

    this.loading = {
      durations: null,
    };

    this.agree = {
      value: false,
    };

    return this.User.getUser().then((user) => {
      this.ovhSubsidiary = user.ovhSubsidiary;
    });
  }

  loadPrices(durations) {
    const queue = [];
    this.loading.prices = true;

    angular.forEach(durations, (duration) => {
      queue.push(
        this.DedicatedCloud.getUpgradeResourceOrder(
          this.productId,
          this.upgradeType,
          duration,
          this.type,
          this.id,
        ).then((details) => {
          this.durations.details[duration] = details;
        }),
      );
    });

    this.$q.all(queue).then(
      () => {
        if (durations && durations.length === 1) {
          this.model.duration = head(durations);
        }
        this.loading.prices = false;
      },
      (data) => {
        this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_order_loading_error',
          )} ${data.data.message || data.message || data.data}`,
          'danger',
        );
      },
    );
  }

  getDurations() {
    this.durations = {
      available: null,
      details: {},
    };
    this.loading.durations = true;

    this.DedicatedCloud.getUpgradeResourceDurations(
      this.productId,
      this.upgradeType,
      this.type,
      this.id,
    ).then((durations) => {
      this.loading.durations = false;
      this.durations.available = durations;
      this.loadPrices(durations);
    });
  }

  loadContracts() {
    this.agree.value = false;
    if (
      !this.durations.details[this.model.duration].contracts ||
      !this.durations.details[this.model.duration].contracts.length
    ) {
      this.$rootScope.$broadcast('wizard-goToStep', 5);
    }
  }

  backToContracts() {
    if (
      !this.durations.details[this.model.duration].contracts ||
      !this.durations.details[this.model.duration].contracts.length
    ) {
      this.$rootScope.$broadcast('wizard-goToStep', 2);
    }
  }

  getResumePrice(price) {
    return price.value === 0
      ? this.$translate.instant('price_free')
      : this.$translate.instant('price_ht_label', { t0: price.text });
  }

  upgradedResource() {
    this.loading.validation = true;
    let orderUrl = '';

    // You cannot call window.open in an async call in safari (like the follow promise)
    // so hold a ref to a new window and set the url once it get it.
    const windowRef = this.$window.open();
    this.DedicatedCloud.upgradedResource(
      this.productId,
      this.upgradeType,
      this.model.duration,
      this.type,
      this.id,
    )
      .then((order) => {
        const message = this.$translate.instant(
          'dedicatedCloud_order_finish_success',
          {
            t0: order.url,
            t1: order.orderId,
          },
        );
        this.goBack(message);
        orderUrl = order.url;
      })
      .catch((data) => {
        const message = this.$translate.instant(
          'dedicatedCloud_order_finish_error',
        );
        this.goBack(`${message} ${data.message || data.data}`, 'danger');
      })
      .finally(() => {
        this.loading.validation = false;
        if (isEmpty(orderUrl)) {
          windowRef.close();
        } else {
          windowRef.location = orderUrl;
        }
      });
  }
}
