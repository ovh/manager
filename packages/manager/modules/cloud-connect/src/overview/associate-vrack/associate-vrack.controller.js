import get from 'lodash/get';

export default class AssociateVrackCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
  }

  associateVrack() {
    this.isLoading = true;
    this.cloudConnectService
      .associateVrack(this.vRack.id, this.cloudConnect.id)
      .then(() => {
        const vRackName = this.vRack.name ? this.vRack.name : this.vRack.id;
        this.cloudConnect.vrack = this.vRack.id;
        this.cloudConnect.vrackName = vRackName;
        // this.cloudConnectService.getVrackAssociatedCloudConnect(this.vrack.id);
        return this.goBack(
          this.$translate.instant('cloud_connect_vrack_associate_success', {
            vRackName,
          }),
          'success',
          false,
          this.$translate.instant(
            'cloud_connect_vrack_associate_cloud_connect',
          ),
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_vrack_associate_error', {
            vRackName: this.vRack.name || this.vRack.id,
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
