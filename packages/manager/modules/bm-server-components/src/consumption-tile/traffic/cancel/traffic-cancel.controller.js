import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import set from 'lodash/set';

export default class ServerCancelTrafficCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $rootScope,
    $stateParams,
    User,
    Server,
    ServerOrderTrafficService,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$rootScope = $rootScope;
    this.User = User;
    this.Server = Server;
    this.ServerOrderTrafficService = ServerOrderTrafficService;

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
        load: () =>
          this.handleAPIGet(
            () => this.User.getUser().then((user) => ({ data: user })),
            this.user,
          ),
      },
    ];

    // Ugly patch... the wizard won't resolve its step-on-load event handler
    // if it isn't on the scope..
    this.$scope.initUser = this.steps[0].load.bind(this);

    // Same thing for reset action and open openBC
    this.$scope.cancelOption = this.cancelOption.bind(this);
  }

  cancelOption() {
    this.handleAPIGet(
      () =>
        this.ServerOrderTrafficService.cancelOption(
          this.$stateParams.productId,
        ),
      this.cancelAction,
    )
      .then(() =>
        this.$rootScope.$broadcast('dedicated.informations.bandwidth'),
      )
      .finally(() => this.goBack());
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

        this.goBack();
        response.data.type = 'ERROR';
        this.$scope.setMessage(response.message, response.data);
      })
      .finally(() => {
        set(loadIntoStruct, 'loading', false);
      });
  }
}
