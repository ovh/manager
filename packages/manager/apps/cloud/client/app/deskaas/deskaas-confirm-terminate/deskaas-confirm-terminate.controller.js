import get from 'lodash/get';

export default class DeskaasConfirmTerminateCtrl {
  /* @ngInject */
  constructor(
    $location,
    $translate,
    OvhApiDeskaasService,
  ) {
    this.$location = $location;
    this.$translate = $translate;
    this.OvhApiDeskaasService = OvhApiDeskaasService;
    this.values = {
      reason: '',
      commentary: '',
    };
    this.flags = {
      init: false,
    };
  }

  removeConfirmationParams() {
    if (this.$location.$$search.action) {
      delete this.$location.$$search.action; // eslint-disable-line
    }
    if (this.$location.$$search.token) {
      delete this.$location.$$search.token; // eslint-disable-line
    }
    // Do not reload url
    this.$location.$$compose();
  }

  cancel() {
    this.removeConfirmationParams();
    this.goBackToDetails(null, null, null, true);
  }

  ok() {
    // clear params needed to display confirmation
    this.removeConfirmationParams();
    if (!this.values.token && !this.values.reason) {
      this.cancel();
    }
    this.terminate(this.values);
  }

  terminate(terminateParams) {
    this.flags.init = true;
    this.OvhApiDeskaasService.v6()
      .confirmTerminate({
        serviceName: this.serviceName,
      }, {
        token: terminateParams.token,
        reason: terminateParams.reason,
        commentary: terminateParams.commentary,
      }).$promise
      .then(result => this.goBackToDetails(
        this.$translate.instant('vdi_terminate_confirming', {
          serviceName: this.serviceName,
        }),
        'success',
        {
          task: result.taskId,
        },
        true,
      )).catch((error) => {
        this.goBackToDetails(
          this.$translate.instant('common_api_error', {
            id: this.serviceName,
            message: get(error, 'data.message'),
          }),
          'error',
          null,
          true,
        );
      })
      .finally(() => {
        this.flags.init = false;
      });
  }

  $onInit() {
    this.values.token = this.token;
    this.flags.init = false;
  }
}
