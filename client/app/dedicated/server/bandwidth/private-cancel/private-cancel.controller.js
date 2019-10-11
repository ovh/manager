export default class {
  /* @ngInject */
  constructor($scope, $stateParams, $rootScope, User, Server, BandwidthVrackOrderService) {
    this.setMessage = $scope.setMessage;
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

    this.steps[0].load();
  }

  cancelOption() {
    this.handleAPIGet(() => this.BandwidthVrackOrderService
      .cancelBandwidthOption(this.$stateParams.productId), this.cancelAction)
      .then(() => this.$rootScope.$broadcast('dedicated.informations.bandwidth'))
      .finally(() => this.goBack());
  }

  handleAPIGet(promise, loadIntoStruct) {
    _.set(loadIntoStruct, 'loading', true);
    return promise()
      .then((response) => {
        _.set(loadIntoStruct, 'hasError', false);
        _.set(loadIntoStruct, 'data', response.data);

        if (response.message) {
          this.setMessage(response.message, true);
        }
      })
      .catch((response) => {
        _.set(loadIntoStruct, 'hasError', true);
        _.set(loadIntoStruct, 'data', _.isArray(loadIntoStruct) ? [] : {});

        response.data.type = 'ERROR';
        this.setMessage(response.message, response.data);
        this.goBack();
      })
      .finally(() => _.set(loadIntoStruct, 'loading', false));
  }
}
