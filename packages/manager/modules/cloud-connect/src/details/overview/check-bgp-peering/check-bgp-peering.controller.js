import get from 'lodash/get';
import {
  diagnosticTypes,
  ApiDiagnosticStatus,
} from './check-pgp-peering.constants';
import {
  TRACKING_PREFIX,
  DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
  getDiagnosticDashboardTrackingContext,
} from '../../../cloud-connect.constants';

export default class CheckBGPPeeringCtrl {
  /* @ngInject */
  constructor(
    atInternet,
    $state,
    $timeout,
    $translate,
    cloudConnectService,
    $sce,
  ) {
    this.atInternet = atInternet;
    this.$translate = $translate;
    this.$state = $state;
    this.$sce = $sce;
    this.$timeout = $timeout;
    this.cloudConnectService = cloudConnectService;
    this.diagnosticTypes = diagnosticTypes;
  }

  $onInit() {
    this.diagnosticName = this.isExtra ? 'diagPeeringExtra' : 'diagPeering';
    this.diagnosticType = this.diagnosticTypes.default;
    this.isLoading = false;
    this.optionSelected = false;
  }

  selectOption() {
    this.optionSelected = true;
  }

  cancel() {
    if (this.optionSelected) {
      this.atInternet.trackClick({
        name: `${TRACKING_PREFIX}pop-up::button::check_bgp-peering::cancel`,
        type: 'action',
        ...getDiagnosticDashboardTrackingContext(
          'cloud-connect::pop-up::check::bgp-peering',
        ),
      });
    }
    return this.goBack();
  }

  runDagnostic() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}pop-up::button::check_bgp-peering-${this.diagnosticType}::confirm`,
      type: 'action',
      ...getDiagnosticDashboardTrackingContext(
        'cloud-connect::pop-up::check::bgp-peering',
      ),
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
            name: `${TRACKING_PREFIX}cloud-connect::banner-info::create_diagnostic_pending`,
            type: 'display',
            ...DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
          });
          return this.goBack(
            this.$sce.trustAsHtml(
              this.$translate.instant('cloud_connect_bgp_peering_success', {
                link: this.$state.href('cloud-connect.details.diagnostics', {
                  cloudConnect: this.cloudConnectService,
                }),
              }),
            ),
            'success',
            false,
          ).then(() => {
            this.$timeout(() => {
              $('#diagnostic-success-link').bind('click', () => {
                this.atInternet.trackClick({
                  name: `${TRACKING_PREFIX}banner::link::go-to-diagnostic-results-${this.diagnosticType}`,
                  type: 'action',
                  ...getDiagnosticDashboardTrackingContext(
                    'cloud-connect::dashboard::configure',
                  ),
                });
              });
            });
          });
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
          name: `${TRACKING_PREFIX}cloud-connect::banner-error::create_diagnostic_error`,
          type: 'display',
          ...DIAGNOSTIC_DASHBOARD_TRACKING_CONTEXT,
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
