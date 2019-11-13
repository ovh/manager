import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
} from './dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    OvhApiDedicatedCloud,
    OvhApiMe,
    OvhApiOrder,
    ovhPaymentMethod,
    ovhUserPref,
  ) {
    this.OvhApiDedicatedCloud = OvhApiDedicatedCloud;
    this.OvhApiMe = OvhApiMe;
    this.OvhApiOrder = OvhApiOrder;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.ovhUserPref = ovhUserPref;
  }

  /* ================================= */
  /*       Information Getters         */
  /* ================================= */


  getPccIpAddresses(serviceName) {
    return this.OvhApiDedicatedCloud.Ip().v6().query({
      serviceName,
    }).$promise
      .then(ipAddresses => ipAddresses
        .map(ipAddress => this.OvhApiDedicatedCloud.Ip().v6()
          .get({
            serviceName,
            network: ipAddress,
          }).$promise));
  }

  getPccDrpPlan(serviceName) {
    return this.OvhApiDedicatedCloud.Datacenter().v6().query({
      serviceName,
    }).$promise
      .then(datacenters => Promise.all(datacenters
        .map(datacenterId => this.getDrpState({
          serviceName,
          datacenterId,
        }))))
      .catch(error => (DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES
        .includes(error.status)
        ? Promise.resolve([]) : Promise.reject(error)));
  }

  getPccIpAddressesDetails(serviceName) {
    return this.OvhApiDedicatedCloud.Ip().v6().query({
      serviceName,
    }).$promise
      .then(ipAddresses => Promise.all(ipAddresses
        .map(ipAddress => this.OvhApiDedicatedCloud.Ip().Details()
          .v6()
          .get({
            serviceName,
            network: ipAddress,
          }).$promise))
        .then(ipAddressesDetails => _.flatten(ipAddressesDetails)));
  }

  getDrpState(serviceInformations) {
    return this.OvhApiDedicatedCloud
      .Datacenter().Zerto().v6().state(serviceInformations, null).$promise
      .then(state => ({ ...state, ...serviceInformations }));
  }

  getDefaultLocalVraNetwork(serviceInformations) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .getDefaultLocalVraNetwork(serviceInformations).$promise
      .then(({ value: defaultLocalVraNetwork }) => defaultLocalVraNetwork);
  }

  /* ---- END Information Getters ---- */

  /* ================================= */
  /*          PCC Legacy Ovh           */
  /* ================================= */

  enableDrp(drpInformations, isLegacy) {
    const isOvhToOvhPlan = drpInformations
      .drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh;

    if (!isLegacy) {
      return isOvhToOvhPlan
        ? this.enableDrpOvh(drpInformations)
        : this.enableDrpOnPremise(drpInformations);
    }

    return isOvhToOvhPlan ? this.enableDrpOvhLegacy(drpInformations)
      : this.enableDrpOnPremiseLegacy(drpInformations);
  }

  enableDrpOvhLegacy({
    primaryPcc,
    primaryDatacenter,
    primaryEndpointIp,
    secondaryPcc,
    secondaryDatacenter,
    secondaryEndpointIp,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6().enable({
      serviceName: primaryPcc.serviceName,
      datacenterId: primaryDatacenter.id,
    }, {
      primaryEndpointIp,
      secondaryServiceName: secondaryPcc.serviceName,
      secondaryDatacenterId: secondaryDatacenter.id,
      secondaryEndpointIp,
    }).$promise;
  }

  enableDrpOnPremiseLegacy({
    primaryPcc,
    primaryDatacenter,
    localVraNetwork,
    primaryEndpointIp: ovhEndpointIp,
    remoteVraNetwork,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .enable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        localVraNetwork,
        ovhEndpointIp,
        remoteVraNetwork,
      }).$promise;
  }

  /* ------ END PCC Legacy OVH ------- */

  /* ================================= */
  /*        Order ZERTO option         */
  /* ================================= */

  enableDrpOvh(drpInformations) {
    return this.orderZertoOption(
      drpInformations,
      DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh,
    );
  }

  enableDrpOnPremise(drpInformations) {
    return this.orderZertoOption(
      drpInformations,
      DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.onPremise,
    );
  }

  createZertoOptionCart(drpInformations, zertoOption) {
    let zertoCartId;
    return this.OvhApiMe.v6().get().$promise
      .then(({ ovhSubsidiary }) => this.OvhApiOrder.Cart().v6()
        .post({}, { ovhSubsidiary })
        .$promise)
      .then(({ cartId }) => {
        zertoCartId = cartId;
        return this.OvhApiOrder.Cart().v6().assign({ cartId }).$promise;
      })
      .then(() => this.OvhApiOrder.Cart().ServiceOption().v6().get({
        productName: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
        serviceName: drpInformations.primaryPcc.serviceName,
      }).$promise)
      .then((offers) => {
        const [firstOffer] = offers;
        const [firstPrice] = firstOffer.prices;

        return this.OvhApiOrder.Cart().ServiceOption().v6().post({
          productName: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
          serviceName: drpInformations.primaryPcc.serviceName,
        }, {
          cartId: zertoCartId,
          duration: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.duration,
          planCode: zertoOption,
          pricingMode: firstPrice.pricingMode,
          quantity: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.quantity,
        }).$promise;
      });
  }

  validateZertoOptionCart(cartId) {
    let autoPayWithPreferredPaymentMethod;
    return Promise.all({
      availableAutomaticPaymentsMean:
        this.OvhApiMe.AvailableAutomaticPaymentMeans().v6().get().$promise,
      allPaymentMethods:
        this.ovhPaymentMethod
          .getAllPaymentMethods({ onlyValid: true, transform: true }),
    })
      .then(({ availableAutomaticPaymentsMean, allPaymentMethods }) => {
        const availablePaymentType = _.flatten(
          allPaymentMethods.map(({ paymentType }) => paymentType),
        );
        autoPayWithPreferredPaymentMethod = availablePaymentType
          .some(
            ({ value }) => _.get(
              availableAutomaticPaymentsMean, _.camelCase(value),
            ),
          );

        return this.OvhApiOrder.Cart().v6().checkout({
          cartId,
        }, {
          autoPayWithPreferredPaymentMethod,
          waiveRetractationPeriod: false,
        }).$promise;
      })
      .then(({ orderId, url }) => ({
        hasAutoPay: autoPayWithPreferredPaymentMethod,
        orderId,
        url,
        state: DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDo,
      }));
  }

  orderZertoOption(drpInformations, zertoOption) {
    let zertoCartId;
    return this.createZertoOptionCart(drpInformations, zertoOption)
      .then(({ cartId, itemId }) => {
        zertoCartId = cartId;
        return this.addCartZertoOptionConfiguration(
          cartId,
          itemId,
          this.constructor.getZertoConfiguration(drpInformations, zertoOption),
        );
      })
      .then(() => this.validateZertoOptionCart(zertoCartId));
  }

  addCartZertoOptionConfiguration(cartId, itemId, drpInformations) {
    const parametersToSet = _.keys(drpInformations);

    return Promise.all(parametersToSet
      .map(parameter => this.OvhApiOrder.Cart().Item().Configuration().v6()
        .post({
          cartId,
          itemId,
          label: parameter,
          value: _.get(drpInformations, parameter),
        }).$promise));
  }

  checkForZertoOptionOrder(pccId) {
    let storedZertoOption;

    const preferenceKey = this.constructor
      .formatPreferenceKey(pccId, DEDICATEDCLOUD_DATACENTER_ZERTO.title);

    return this.ovhUserPref.getValue(preferenceKey)
      .then(({ drpInformations, zertoOptionOrderId }) => {
        if (drpInformations != null
            && drpInformations.primaryPcc.serviceName === pccId) {
          storedZertoOption = drpInformations;
          return this.getZertoOptionOrderStatus(zertoOptionOrderId);
        }

        return Promise.resolve({});
      })
      .then(({ status: zertoOrderStatus }) => {
        const pendingOrderStatus = [
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
        ].find(status => status === zertoOrderStatus);

        return pendingOrderStatus != null
          ? { ...storedZertoOption, state: pendingOrderStatus }
          : Promise.resolve(null);
      })
      .catch(error => (error.status === 404
        ? Promise.resolve(null)
        : Promise.reject(error)));
  }

  getZertoOptionOrderStatus(orderId) {
    return this.OvhApiMe.Order().v6().getStatus({ orderId }).$promise;
  }

  /* ------- Order ZERTO option ------ */

  disableDrp(drpInformations) {
    const deleteDrpPromise = drpInformations
      .drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
      ? this.disableDrpOvh(drpInformations)
      : this.disableDrpOnPremise(drpInformations);

    return deleteDrpPromise.then(() => this
      .deleteDisableSuccessAlertPreference(drpInformations.primaryPcc
        .serviceName));
  }

  disableDrpOvh({
    primaryPcc,
    primaryDatacenter,
    secondaryPcc,
    secondaryDatacenter,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6()
      .disable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        secondaryServiceName: secondaryPcc.serviceName,
        secondaryDatacenterId: secondaryDatacenter.id,
      }).$promise;
  }

  disableDrpOnPremise({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .disable({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, null).$promise;
  }

  regenerateZsspPassword({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().v6()
      .generateZsspPassword({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, null).$promise;
  }

  configureVpn({
    primaryPcc,
    primaryDatacenter,
    remoteVraNetwork,
    vpnConfiguration,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter().Zerto().Single().v6()
      .configureVpn({
        serviceName: primaryPcc.serviceName,
        datacenterId: primaryDatacenter.id,
      }, {
        preSharedKey: vpnConfiguration.preSharedKey,
        remoteEndpointInternalIp: vpnConfiguration.remoteEndpointInternalIp,
        remoteEndpointPublicIp: vpnConfiguration.remoteEndpointPublicIp,
        remoteVraNetwork,
        remoteZvmInternalIp: vpnConfiguration.remoteZvmInternalIp,
      }).$promise;
  }

  getDisableSuccessAlertPreference(pccId) {
    const preferenceKey = this.constructor
      .formatPreferenceKey(pccId, DEDICATEDCLOUD_DATACENTER_ZERTO
        .alertPreference);

    return this.ovhUserPref.getValue(preferenceKey);
  }

  setDisableSuccessAlertPreference(pccId) {
    const preferenceKey = this.constructor
      .formatPreferenceKey(pccId, DEDICATEDCLOUD_DATACENTER_ZERTO
        .alertPreference);

    return this.ovhUserPref.create(preferenceKey, true);
  }

  deleteDisableSuccessAlertPreference(pccId) {
    const preferenceKey = this.constructor
      .formatPreferenceKey(pccId, DEDICATEDCLOUD_DATACENTER_ZERTO
        .alertPreference);

    return this.ovhUserPref.remove(preferenceKey, true);
  }

  static getPlanServiceInformations({
    drpType,
    datacenterId,
    remoteSiteInformation,
    serviceName,
  }) {
    return {
      drpType,
      primaryPcc: {
        serviceName,
      },
      primaryDatacenter: {
        id: datacenterId,
      },
      secondaryPcc: {
        serviceName: remoteSiteInformation.serviceName,
      },
      secondaryDatacenter: {
        id: remoteSiteInformation.datacenterId,
      },
    };
  }

  static formatPreferenceKey(pccId, keyPreference) {
    const { splitter } = DEDICATEDCLOUD_DATACENTER_ZERTO;
    const [, ...[formattedServiceName]] = pccId.split(splitter);
    const preferenceKey = `${keyPreference}_${formattedServiceName.replace(/-/g, '')}`;

    return preferenceKey;
  }

  static formatStatus(status) {
    switch (status) {
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering;
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toUnprovision:
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.unprovisionning:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling;
      case DEDICATEDCLOUD_DATACENTER_DRP_STATUS.error:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.error;
      default:
        return DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled;
    }
  }

  static getZertoConfiguration(drpInformations, zertoOption) {
    return zertoOption === DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS
      .zertoOption.ovh
      ? {
        datacenter_id: drpInformations.primaryDatacenter.id,
        primaryEndpointIp: drpInformations.primaryEndpointIp,
        secondaryEndpointIp: drpInformations.secondaryEndpointIp,
        secondaryServiceName: drpInformations.secondaryPcc.serviceName,
        secondaryDatacenterId: drpInformations.secondaryDatacenter.id,
      }
      : {
        datacenter_id: drpInformations.primaryDatacenter.id,
        ovhEndpointIp: drpInformations.ovhEndpointIp,
        localVraNetwork: drpInformations.localVraNetwork,
        remoteVraNetwork: drpInformations.remoteVraNetwork,
      };
  }
}
