(() => {
  class ServerOrderTrafficCtrl {
    constructor($scope, $stateParams, $translate, User, ServerOrderTrafficService) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.ServerOrderTrafficService = ServerOrderTrafficService;
      this.User = User;

      const loadingStruct = {
        loading: false,
        hasError: false,
        data: [],
      };

      this.orderables = _.cloneDeep(loadingStruct);
      this.durations = _.cloneDeep(loadingStruct);
      this.bc = _.cloneDeep(loadingStruct);

      this.user = _.cloneDeep(loadingStruct);
      this.user.data = {};

      this.model = {
        traffic: null,
        duration: null,
        agree: false,
      };

      this.steps = [
        {
          isValid: () => !this.orderables.loading
            && this.orderables.data.length > 0
            && this.model.traffic,
          isLoading: () => this.orderables.loading,
          load: () => this.handleAPIGet(() => this.ServerOrderTrafficService
            .getOrderables($stateParams.productId), this.orderables)
            .then(() => {
              if (this.orderables.data.length === 1) {
                this.model.traffic = _.first(this.orderables.data);
              }
            }),
        },
        {
          isValid: () => !this.durations.loading
            && this.durations.data.length > 0
            && this.model.duration,
          isLoading: () => this.durations.loading || this.user.loading,
          load: () => {
            this.handleAPIGet(() => this.User.getUser().then(user => ({ data: user })), this.user);
            this.handleAPIGet(() => this.ServerOrderTrafficService
              .getOrderableDurations(
                this.$stateParams.productId,
                this.model.traffic.value,
              ), this.durations)
              .then(() => {
                if (this.durations.data.length === 1) {
                  this.model.duration = _.first(this.durations.data);
                }
              });
          },
        },
        {
          isValid: () => !this.bc.loading && this.model.agree,
          isLoading: () => this.bc.loading,
          load: () => {
            this.model.agree = false;
            this.handleAPIGet(() => this.ServerOrderTrafficService.order(
              this.$stateParams.productId,
              this.model.traffic.value,
              this.model.duration.durations,
            ), this.bc);
          },
        },
        {
          isValid: () => !this.bc.loading,
          isLoading: () => this.bc.loading,
        },
      ];

      // Ugly patch... the wizard won't resolve its step-on-load event handler
      // if it isn't on the scope..
      this.$scope.initOrderables = this.steps[0].load.bind(this);
      this.$scope.initDurations = this.steps[1].load.bind(this);
      this.$scope.initBC = this.steps[2].load.bind(this);

      // Same thing for reset action and open openBC
      this.$scope.openBC = this.openBC.bind(this);
    }

    openBC() {
      this.$scope.resetAction();
      this.$scope.setMessage(this.$translate.instant('server_order_traffic_success', {
        t0: this.bc.data.url,
      }), true);
      window.open(this.bc.data.url);
    }

    handleAPIGet(promise, loadIntoStruct) {
      _.set(loadIntoStruct, 'loading', true);
      return promise()
        .then((response) => {
          _.set(loadIntoStruct, 'hasError', false);
          _.set(loadIntoStruct, 'data', response.data);

          if (response.message) {
            this.$scope.setMessage(response.message, true);
          }
        })
        .catch((response) => {
          _.set(loadIntoStruct, 'hasError', true);
          _.set(loadIntoStruct, 'data', _.isArray(loadIntoStruct) ? [] : {});

          this.$scope.resetAction();
          response.data.type = 'ERROR';
          this.$scope.setMessage(response.message, response.data);
        })
        .finally(() => {
          _.set(loadIntoStruct, 'loading', false);
        });
    }
  }

  angular.module('App').controller('ServerOrderTrafficCtrl', ServerOrderTrafficCtrl);
})();
