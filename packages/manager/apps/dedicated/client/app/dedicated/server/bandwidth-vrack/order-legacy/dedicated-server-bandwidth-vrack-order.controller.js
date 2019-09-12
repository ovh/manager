import cloneDeep from 'lodash/cloneDeep';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import set from 'lodash/set';

class ServerOrderLegacyBandwidthVrackCtrl {
  constructor($scope, $stateParams, $translate, User, BandwidthVrackOrderService) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.BandwidthVrackOrderService = BandwidthVrackOrderService;
    this.User = User;

    const loadingStruct = {
      loading: false,
      hasError: false,
      data: [],
    };

    this.orderableBandwidths = cloneDeep(loadingStruct);
    this.orderableDurations = cloneDeep(loadingStruct);
    this.bc = cloneDeep(loadingStruct);

    this.user = cloneDeep(loadingStruct);
    this.user.data = {};

    this.model = {
      bandwidth: null,
      duration: null,
    };

    this.steps = [
      {
        isValid: () => !this.orderableBandwidths.loading
          && this.orderableBandwidths.data.length > 0
          && this.model.bandwidth,
        isLoading: () => this.orderableBandwidths.loading,
        load: () => this.handleAPIGet(() => this.BandwidthVrackOrderService
          .getOrderableBandwidths(this.$stateParams.productId), this.orderableBandwidths)
          .then(() => {
            if (this.orderableBandwidths.data.length === 1) {
              this.model.bandwidth = head(this.orderableBandwidths.data);
            }
          }),
      },
      {
        isValid: () => !this.orderableDurations.loading
          && this.orderableDurations.data.length > 0
          && this.model.duration,
        isLoading: () => this.orderableDurations.loading || this.user.loading,
        load: () => {
          this.handleAPIGet(() => this.User.getUser().then(user => ({ data: user })), this.user);
          this.handleAPIGet(() => this.BandwidthVrackOrderService
            .getOrderableBandwidthDurations(
              this.$stateParams.productId,
              this.model.bandwidth.value,
            ), this.orderableDurations)
            .then(() => {
              if (this.orderableDurations.data.length === 1) {
                this.model.duration = head(this.orderableDurations.data);
              }
            });
        },
      },
      {
        isValid: () => !this.bc.loading,
        isLoading: () => this.bc.loading,
        load: () => this.handleAPIGet(() => this.BandwidthVrackOrderService.orderBandWidth(
          this.$stateParams.productId,
          this.model.bandwidth.value,
          this.model.duration.durations,
        ), this.bc),
      },
    ];

    // Ugly patch... the wizard won't resolve its step-on-load event handler
    // if it isn't on the scope..
    this.$scope.initBandwidthOrderables = this.steps[0].load.bind(this);
    this.$scope.initBandwidthDurations = this.steps[1].load.bind(this);
    this.$scope.initBandwidthBC = this.steps[2].load.bind(this);

    // Same thing for reset action and open openBC
    this.$scope.openBC = this.openBC.bind(this);
  }

  openBC() {
    this.$scope.resetAction();
    this.$scope.setMessage(this.$translate.instant('server_order_bandwidth_vrack_success', {
      t0: this.bc.data.url,
    }), true);
    window.open(this.bc.data.url);
  }

  handleAPIGet(promise, loadIntoStruct) {
    set(loadIntoStruct, 'loading', true);
    return promise()
      .then((response) => {
        set(loadIntoStruct, 'hasError', false);
        set(loadIntoStruct, 'data', response.data);

        if (response.message) {
          this.$scope.setMessage(response.message, true);
        }
      })
      .catch((response) => {
        set(loadIntoStruct, 'hasError', true);
        set(loadIntoStruct, 'data', isArray(loadIntoStruct) ? [] : {});

        this.$scope.resetAction();
        response.data.type = 'ERROR';
        this.$scope.setMessage(response.message, response.data);
      })
      .finally(() => {
        set(loadIntoStruct, 'loading', false);
      });
  }
}

angular.module('App').controller('ServerOrderLegacyBandwidthVrackCtrl', ServerOrderLegacyBandwidthVrackCtrl);
