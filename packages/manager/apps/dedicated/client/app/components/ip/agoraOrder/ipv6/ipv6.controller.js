import find from 'lodash/find';

import { PRODUCT_TYPES, ALERT_ID } from '../ip-ip-agoraOrder.constant';

export default class AgoraIpV6OrderController {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    $window,
    Alerter,
    IpAgoraOrder,
    User,
    coreConfig,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.$window = $window;
    this.Alerter = Alerter;
    this.IpAgoraOrder = IpAgoraOrder;
    this.User = User;
    this.ALERT_ID = ALERT_ID;
    this.region = coreConfig.getRegion();
    this.ovhSubsidiary = coreConfig.getUser().ovhSubsidiary;
    this.loading = {};
  }

  $onInit() {
    this.model = {
      params: {},
      selectedService: null,
    };
    this.user = this.$state.params.user;
    this.catalogName = this.$state.params.catalogName;
    console.log(this.region);
  }

  loadServices() {
    this.loading.services = true;

    return this.$q
      .all({
        user: this.User.getUser(),
        services: this.IpAgoraOrder.getVrackService(),
      })
      .then((results) => {
        this.user = results.user;
        this.services = results.services;
        if (this.$state.params.service) {
          this.model.selectedService = find(this.services, {
            serviceName: this.$state.params.service.serviceName,
          });
        }
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant('ip_order_loading_error', this.ALERT_ID),
        );
        return this.$state.go('^').then(() => this.$q.reject(err));
      })
      .finally(() => {
        this.loading.services = false;
      });
  }

  loadRegions() {
    const ipCountryAvailablePromise = this.IpAgoraOrder.getIpCountryAvailablePromise(
      this.model.selectedService.serviceName,
      PRODUCT_TYPES.vrack.typeName,
    );

    return ipCountryAvailablePromise
      .then((data) => {
        // let countries = data;
        console.log(data);
        // if (data.length === 0) {
        //   const REGION = AgoraIpV4OrderController.getRegionFromServiceName(
        //     this.model.selectedService.serviceName,
        //   );
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
