import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import set from 'lodash/set';

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

    this.user = cloneDeep(loadingStruct);
    this.cancelAction = cloneDeep(loadingStruct);

    this.steps = [
      {
        isValid: () => !this.user.loading,
        isLoading: () => this.user.loading || this.cancelAction.loading,
        load: () => this.handleAPIGet(() => this.User.getUser()
          .then((user) => ({ data: user })), this.user),
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
    set(loadIntoStruct, 'loading', true);
    return promise()
      .then((response) => {
        set(loadIntoStruct, 'hasError', false);
        set(loadIntoStruct, 'data', response.data);

        if (response.message) {
          this.setMessage(response.message, true);
        }
      })
      .catch((response) => {
        set(loadIntoStruct, 'hasError', true);
        set(loadIntoStruct, 'data', isArray(loadIntoStruct) ? [] : {});

        response.data.type = 'ERROR';
        this.setMessage(response.message, response.data);
        this.goBack();
      })
      .finally(() => set(loadIntoStruct, 'loading', false));
  }
}
