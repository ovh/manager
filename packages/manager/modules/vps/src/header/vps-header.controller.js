import includes from 'lodash/includes';
import filter from 'lodash/filter';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

import {
  STOP_NOTIFICATION_USER_PREF,
  TAB_FEATURES,
} from './vps-header.constants';

import { PRODUCT_NAME } from '../constants';

export default class {
  /* @ngInject */
  constructor(
    $rootScope,
    $translate,
    CucCloudMessage,
    CucFeatureAvailabilityService,
    CucProductsService,
    OvhApiMe,
    VpsNotificationIpv6,
  ) {
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.CucProductsService = CucProductsService;
    this.OvhApiMe = OvhApiMe;
    this.VpsNotificationIpv6 = VpsNotificationIpv6;

    this.description = this.serviceName;

    this.loaders = {
      init: false,
    };
    this.stopNotification = {
      autoRenew: true,
      ipV6: true,
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

    this.description = this.CucProductsService.getDisplayName(
      PRODUCT_NAME,
      this.serviceName,
    );
    this.features = this.getFeatures();
    [this.feature] = this.features;
  }

  getFeatures() {
    return map(
      filter(map(TAB_FEATURES, 'title'), (feature) =>
        this.capabilities.includes(feature),
      ),
      (feature) => ({
        textId: `vps_tab_${snakeCase(feature)}`,
        state: `vps.detail.${feature}`,
      }),
    );
  }

  checkMessages(vps) {
    this.isExpired(vps);
    this.isInRescueMode(vps.netbootMode);
    this.checkIfStopNotification('ipV6', true, vps);
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

  isInRescueMode(netbootMode) {
    if (netbootMode === 'RESCUE') {
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

  showIpV6Banner(version, ipv6) {
    const oldVersion = includes(version, '2014') || includes(version, '2013');
    const userAcknowledged = this.stopNotification.ipV6;
    if (!userAcknowledged && !oldVersion && ipv6) {
      this.CucCloudMessage.info(
        {
          textHtml: this.$translate.instant('vps_configuration_ipV6_info_text'),
          dismissed: this.stopNotification.ipV6,
          dismiss: () => this.stopNotificationIpV6(),
        },
        'vps.detail.dashboard',
      );
    }
  }

  checkIfStopNotification(message, isArray, vps) {
    const item = vps.name;
    return this.VpsNotificationIpv6.checkIfStopNotification(
      STOP_NOTIFICATION_USER_PREF[message],
      isArray,
      item,
    )
      .then((showNotification) => {
        this.stopNotification[message] = showNotification;
        this.showIpV6Banner(vps.version, vps.ipv6);
      })
      .catch(() => {
        this.stopNotification[message] = false;
      });
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
