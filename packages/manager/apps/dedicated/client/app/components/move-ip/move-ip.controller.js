import get from 'lodash/get';
import head from 'lodash/head';

import { NEW_PRIMARY_IP } from './move-ip.constant';

export default class {
  /* @ngInject */
  constructor($http, $translate, $window, atInternet) {
    this.$http = $http;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.data = {
      selectedIp: head(this.ips),
      targetService: null,
      nextHop: null,
      targets: null,
    };
    this.loaders = {
      targetsLoading: false,
      moving: false,
    };
    return this.getTargetsForIp(this.data.selectedIp);
  }

  checkNextHop() {
    if (get(this.data.targetService, 'nexthop.length', 0)) {
      if (!this.data.targetService.nexthop.includes(NEW_PRIMARY_IP)) {
        this.data.targetService.nexthop.unshift(NEW_PRIMARY_IP);
      }
      this.data.nextHop = NEW_PRIMARY_IP;
    } else {
      this.data.nextHop = null;
    }
  }

  getTargetsForIp(ip) {
    this.data.targetService = null;
    this.data.nextHop = null;
    this.loaders.targetsLoading = true;
    return this.$http
      .get(`/ip/${this.$window.encodeURIComponent(ip)}/move`)
      .then((targetData) => {
        this.data.targets = targetData.data;
      })
      .catch(() => {
        this.data.targets = null;
      })
      .finally(() => {
        this.loaders.targetsLoading = false;
      });
  }

  moveIp() {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::confirm-association`,
      type: 'action',
    });

    this.isUpgrading = true;
    return this.$http
      .post(
        `/ip/${this.$window.encodeURIComponent(this.data.selectedIp)}/move`,
        {
          ...(this.data.nextHop ? { nexthop: this.data.nextHop } : {}),
          to: this.data.targetService.service,
        },
      )
      .then(() =>
        this.goBack(
          this.$translate.instant('dedicatedCloud_move_ip_success', {
            ipBlock: this.data.selectedIp,
            service: this.data.targetService.service,
          }),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('dedicatedCloud_move_ip_error', {
            ipBlock: this.data.selectedIp,
            service: this.data.targetService.service,
            message: get(error, 'message'),
          }),
          'danger',
        ),
      );
  }
}
