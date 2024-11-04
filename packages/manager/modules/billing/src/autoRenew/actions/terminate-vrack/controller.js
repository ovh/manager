export default class TerminateVrackController {
  /* @ngInject */
  constructor($scope, $translate, BillingTerminate, OvhApiVrack) {
    this.$scope = $scope;
    this.TERMINATE_PATTERN = /^TERMINATE$/;
    this.$translate = $translate;
    this.BillingTerminate = BillingTerminate;
    this.OvhApiVrack = OvhApiVrack;
  }

  $onInit() {
    this.$scope.isEmpty = false;
    this.$scope.isLoading = true;
    this.OvhApiVrack.Aapi()
      .services({ serviceName: this.service })
      .$promise.then((allServicesParam) => {
        const services = Object.entries(allServicesParam).filter(
          ([, value]) => {
            return Array.isArray(value) && value.length;
          },
        );
        if (!services.length) {
          this.$scope.isEmpty = true;
        }
      })
      .finally(() => {
        this.$scope.isLoading = false;
      });
  }

  terminate() {
    this.BillingTerminate.serviceTerminationForVrack(this.service)
      .then(() => this.onSuccess())
      .catch((error) => this.onError({ error }));
  }

  onSuccess() {
    this.goBack(
      this.$translate.instant(
        `autorenew_agora_terminate_service_success_VRACK`,
      ),
      'success',
    );
  }

  onError(error) {
    this.goBack(
      this.$translate.instant(`autorenew_agora_terminate_service_error_VRACK`, {
        error: error?.data?.message,
      }),
      'danger',
    );
  }
}
