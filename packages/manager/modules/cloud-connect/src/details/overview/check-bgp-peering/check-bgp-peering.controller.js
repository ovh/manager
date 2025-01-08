import get from 'lodash/get';
import { diagnosticTypes } from './check-pgp-peering.constants';

export default class CheckBGPPeeringCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
    this.diagnosticTypes = diagnosticTypes;
  }

  $onInit() {
    this.diagnosticName = this.isExtra ? 'diagPeeringExtra' : 'diagPeering';
    this.diagnosticType = this.diagnosticTypes.default;
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
          this.$translate.instant('cloud_connect_bgp_peering_success'),
          'success',
          false,
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_bgp_peering_error', {
            message: get(error, 'data.message', error.message),
            requestId: error.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
