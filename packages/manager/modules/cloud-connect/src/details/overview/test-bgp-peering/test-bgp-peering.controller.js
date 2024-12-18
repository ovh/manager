import get from 'lodash/get';

export default class TestBGPPeeringCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.diagnosticName = this.isExtar ? 'diagPeeringExtra' : 'diagPeering';
    this.diagnosticType = '';
    this.isLoading = false;
  }

  runDagnostic() {
    this.isLoading = true;
    this.cloudConnectService
      .runDiagnostic(
        this.cloudConnectId,
        this.dcConfigId,
        this.diagnosticName,
        this.diagnosticType,
        this.extraConfigId,
        this.popConfigId,
      )
      .then(() => {
        return this.goBack(
          this.$translate.instant('cloud_connect_vrack_remove_success'),
          'success',
          false,
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_vrack_remove_error', {
            message: get(error, 'data.message', error.message),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
