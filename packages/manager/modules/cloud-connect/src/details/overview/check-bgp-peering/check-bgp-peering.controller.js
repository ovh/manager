import get from 'lodash/get';
import {
  diagnosticTypes,
  ApiDiagnosticStatus,
} from './check-pgp-peering.constants';
import { DIAGNOSTIC_TRACKING_PREFIX } from '../../../cloud-connect.constants';

export default class CheckBGPPeeringCtrl {
  /* @ngInject */
  constructor(atInternet, $state, $translate, cloudConnectService) {
    this.atInternet = atInternet;
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

  cancel() {
    this.atInternet.trackClick({
      name: `${DIAGNOSTIC_TRACKING_PREFIX}pop-up::button::check_bgp-peering::cancel`,
      type: 'action',
      level2: 99,
    });
    return this.goBack();
  }

  runDagnostic() {
    this.atInternet.trackClick({
      name: `${DIAGNOSTIC_TRACKING_PREFIX}pop-up::button::check_bgp-peering-${this.diagnosticType}::confirm`,
      type: 'action',
      level2: 99,
    });
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
          this.atInternet.trackPage({
            name: `${DIAGNOSTIC_TRACKING_PREFIX}cloud-connect::banner-info::::create_diagnostic_pending`,
            type: 'display',
            level2: 99,
          });
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
      .catch((error) => {
        this.atInternet.trackPage({
          name: `${DIAGNOSTIC_TRACKING_PREFIX}cloud-connect::banner-error::::create_diagnostic_error`,
          type: 'display',
          level2: 99,
        });
        this.goBack(
          this.$translate.instant('cloud_connect_bgp_peering_error', {
            message: get(error, 'data.message', error.message),
            requestId: error.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
