import get from 'lodash/get';
import { AVAILABLE, RTM } from '../vps-dashboard.constants';

export default class VpsRebuildController {
  /* @ngInject */
  constructor(atInternet, vpsRebuild, $http) {
    this.$http = $http;
    this.vpsRebuild = vpsRebuild;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.osRtmCompatibility = false;
    this.vpsOptions = {
      doNotSendPassword: false,
      installRTM: true,
    };
  }

  onOsChange(modelValue) {
    this.$http
      .get(
        `/vps/order/rule/osChoices?datacenter=${this.vps.location.datacentre}&os=${modelValue.name}`,
      )
      .then(({ data }) => {
        this.osRtmCompatibility =
          data.choices.find((choice) => choice.name === RTM)?.status ===
          AVAILABLE;
      });
    this.vpsOptions.imageId = modelValue.id;
  }

  rtmAvailable() {
    return this.availableImages.some(
      (elem) =>
        elem.id === this.vpsOptions.imageId &&
        this.isRtmAvailable &&
        this.osRtmCompatibility,
    );
  }

  rebuildVps(options) {
    const ActiveRtm = options.installRTM && this.rtmAvailable();
    this.atInternet.trackClick({
      name: 'vps::detail::dashboard::rebuild::confirm',
      type: 'action',
    });
    if (ActiveRtm) {
      this.atInternet.trackClick({
        name: 'vps::detail::dashboard::rebuild::activate-rtm',
        type: 'action',
      });
    }
    this.isLoading = true;
    return this.vpsRebuild
      .rebuildVps(this.serviceName, {
        ...options,
        installRTM: ActiveRtm,
      })
      .then(() => this.goBack(false, 'success', {}, { reload: true }))
      .then(() => {
        this.displaySuccess(ActiveRtm);
      })
      .catch((error) =>
        this.goBack().then(() => {
          const errorDetail = get(error, 'data.message', error.message);
          this.displayError('vps_configuration_reinstall_fail', errorDetail);
        }),
      );
  }
}
