class ServerCancelBandwidthVrackCtrl {
  constructor($scope, $stateParams, $rootScope, User, Server, BandwidthVrackOrderService) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$rootScope = $rootScope;
    this.User = User;
    this.Server = Server;
    this.BandwidthVrackOrderService = BandwidthVrackOrderService;

    const loadingStruct = {
      loading: false,
      hasError: false,
      data: [],
    };

    this.user = _.cloneDeep(loadingStruct);
    this.cancelAction = _.cloneDeep(loadingStruct);

    this.steps = [
      {
        isValid: () => !this.user.loading,
        isLoading: () => this.user.loading || this.cancelAction.loading,
        load: () => this.handleAPIGet(() => this.User.getUser()
          .then(user => ({ data: user })), this.user),
      },
    ];

    // Ugly patch... the wizard won't resolve its step-on-load event handler
    // if it isn't on the scope..
    this.$scope.initUser = this.steps[0].load.bind(this);

    // Same thing for reset action and open openBC
    this.$scope.cancelOption = this.cancelOption.bind(this);
  }

  cancelOption() {
    this.handleAPIGet(() => this.BandwidthVrackOrderService
      .cancelBandwidthOption(this.$stateParams.productId), this.cancelAction)
      .then(() => this.$rootScope.$broadcast('dedicated.informations.bandwidth'))
      .finally(() => this.$scope.resetAction());
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

angular.module('App').controller('ServerCancelBandwidthVrackCtrl', ServerCancelBandwidthVrackCtrl);
