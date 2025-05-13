import cloneDeep from 'lodash/cloneDeep';
import head from 'lodash/head';
import isArray from 'lodash/isArray';
import set from 'lodash/set';

export default class ServerOrderTrafficCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $translate,
    User,
    ServerOrderTrafficService,
  ) {
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

    this.orderables = cloneDeep(loadingStruct);
    this.durations = cloneDeep(loadingStruct);
    this.bc = cloneDeep(loadingStruct);

    this.user = cloneDeep(loadingStruct);
    this.user.data = {};

    this.model = {
      traffic: null,
      duration: null,
      agree: false,
    };

    this.steps = [
      {
        isValid: () =>
          !this.orderables.loading &&
          this.orderables.data.length > 0 &&
          this.model.traffic,
        isLoading: () => this.orderables.loading,
        load: () =>
          this.handleAPIGet(
            () =>
              this.ServerOrderTrafficService.getOrderables(
                $stateParams.productId,
              ),
            this.orderables,
          ).then(() => {
            if (this.orderables.data.length === 1) {
              this.model.traffic = head(this.orderables.data);
            }
          }),
      },
      {
        isValid: () =>
          !this.durations.loading &&
          this.durations.data.length > 0 &&
          this.model.duration,
        isLoading: () => this.durations.loading || this.user.loading,
        load: () => {
          this.handleAPIGet(
            () => this.User.getUser().then((user) => ({ data: user })),
            this.user,
          );
          this.handleAPIGet(
            () =>
              this.ServerOrderTrafficService.getOrderableDurations(
                this.$stateParams.productId,
                this.model.traffic.value,
              ),
            this.durations,
          ).then(() => {
            if (this.durations.data.length === 1) {
              this.model.duration = head(this.durations.data);
            }
          });
        },
      },
      {
        isValid: () => !this.bc.loading && this.model.agree,
        isLoading: () => this.bc.loading,
        load: () => {
          this.model.agree = false;
          this.handleAPIGet(
            () =>
              this.ServerOrderTrafficService.order(
                this.$stateParams.productId,
                this.model.traffic.value,
                this.model.duration.durations,
              ),
            this.bc,
          );
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
    this.$scope.setMessage(
      this.$translate.instant('server_order_traffic_success', {
        t0: this.bc.data.url,
      }),
      true,
    );
    this.goBack();
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

        this.goBack();
        response.data.type = 'ERROR';
        this.$scope.setMessage(response.message, response.data);
      })
      .finally(() => {
        set(loadIntoStruct, 'loading', false);
      });
  }
}
