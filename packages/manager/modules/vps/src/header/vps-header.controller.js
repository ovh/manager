import filter from 'lodash/filter';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import {
  STOP_NOTIFICATION_USER_PREF,
  TAB_FEATURES,
} from './vps-header.constants';

export default class {
  /* @ngInject */
  constructor(
    $rootScope,
    $translate,
    CucCloudMessage,
    CucFeatureAvailabilityService,
    CucProductsService,
    OvhApiMe,
    VpsNotificationService,
    constants,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.CucProductsService = CucProductsService;
    this.OvhApiMe = OvhApiMe;
    this.VpsNotificationService = VpsNotificationService;
    this.constants = constants;

    this.description = this.serviceName;

    this.loaders = {
      init: false,
    };
    this.stopNotification = {
      autoRenew: true,
    };
  }

  $onInit() {
    this.$rootScope.$on('changeDescription', (event, data) => {
      this.description = data;
    });
    this.showDatabaseTab = this.hasCloudDatabaseFeature;
    this.description = this.vps.displayName;
    this.checkMessages(this.vps);
    this.$rootScope.$on('tasks.success', (event, opt) => {
      if (opt === this.serviceName) {
        this.checkMessages(this.vps);
      }
    });

    const features = this.getFeatures();

    this.features = features.filter(
      ({ title }) =>
        title !== TAB_FEATURES[0].title ||
        (title === TAB_FEATURES[0].title && this.hasBackupStorage),
    );

    [this.feature] = this.features;
  }

  getFeatures() {
    return map(
      filter(map(TAB_FEATURES, 'title'), (feature) =>
        this.capabilities.includes(feature),
      ),
      (feature) => ({
        title: feature,
        textId: `vps_tab_${snakeCase(feature)}`,
        state: `vps.detail.${feature}`,
      }),
    );
  }

  checkMessages(vps) {
    this.isExpired(vps);
    this.displayWarningForRescueMode(this.isInRescueMode);
  }

  isExpired(vps) {
    if (vps.isExpired) {
      this.CucCloudMessage.warning(
        this.$translate.instant('vps_service_expired', { vps: vps.name }),
        'vps.detail',
      );
    } else if (vps.messages.length > 0) {
      this.CucCloudMessage.error(
        this.$translate.instant('vps_dashboard_loading_error'),
        vps,
      );
    }
  }

  displayWarningForRescueMode(isInRescueMode) {
    if (isInRescueMode) {
      this.CucCloudMessage.warning(
        {
          textHtml: this.$translate.instant(
            'vps_configuration_reboot_rescue_warning_text',
          ),
        },
        'vps.detail',
      );
    }
  }

  checkIsLockedStatus({ lockStatus: { locked: isLocked } }) {
    if (isLocked) {
      this.CucCloudMessage.info(
        this.$translate.instant('vps_dashboard_service_locked'),
        'vps.detail',
      );
    }
  }

  stopNotificationIpV6() {
    this.stopNotification.ipV6 = true;
    this.VpsNotificationIpv6.stopNotification(
      STOP_NOTIFICATION_USER_PREF.ipV6,
      this.vps.name,
    ).catch(() =>
      this.CucCloudMessage.error(
        this.$translate.instant('vps_stop_bother_error'),
      ),
    );
  }
}
