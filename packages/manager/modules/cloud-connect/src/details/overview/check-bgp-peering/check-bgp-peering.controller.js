import get from 'lodash/get';
import {
  diagnosticTypes,
  ApiDiagnosticStatus,
} from './check-pgp-peering.constants';

export default class CheckBGPPeeringCtrl {
  /* @ngInject */
  constructor($state, $translate, cloudConnectService) {
    this.$translate = $translate;
    this.$state = $state;
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
        this.diagnosticName,
        this.popConfigId,
        this.dcConfigId,
        this.diagnosticType,
        this.extraConfigId,
      )
      .then(({ status }) => {
        if (status === ApiDiagnosticStatus.TODO) {
          return this.goBack(
            this.$translate.instant('cloud_connect_bgp_peering_success', {
              link: this.$state.href('cloud-connect.details.diagnostics', {
                cloudConnect: this.cloudConnectService,
              }),
            }),
            'success',
            false,
          );
        }
        if (status === ApiDiagnosticStatus.DENIED) {
          return this.goBack(
            this.$translate.instant('cloud_connect_bgp_peering_denied'),
            'error',
            false,
          );
        }
        return this.goBack(
          this.$translate.instant('cloud_connect_bgp_peering_faild'),
          'error',
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
