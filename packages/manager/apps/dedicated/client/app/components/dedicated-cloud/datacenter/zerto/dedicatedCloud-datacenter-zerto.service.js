import find from 'lodash/find';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import keys from 'lodash/keys';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
  DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
} from './dedicatedCloud-datacenter-zerto.constants';

const moduleName = 'dedicatedCloudDatacenterZertoService';

export class DedicatedCloudDatacenterZertoService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    coreConfig,
    OvhApiDedicatedCloud,
    OvhApiMe,
    OvhApiOrder,
    ovhPaymentMethod,
    ovhUserPref,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.coreConfig = coreConfig;
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
    return this.OvhApiDedicatedCloud.Ip()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((ipAddresses) =>
        ipAddresses.map(
          (ipAddress) =>
            this.OvhApiDedicatedCloud.Ip()
              .v6()
              .get({
                serviceName,
                network: ipAddress,
              }).$promise,
        ),
      );
  }

  getPccZertoPlan(serviceName) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((datacenters) =>
        this.$q.all(
          datacenters.map((datacenterId) =>
            this.getZertoState({
              serviceName,
              datacenterId,
            }),
          ),
        ),
      )
      .catch((error) =>
        DEDICATEDCLOUD_DATACENTER_PCC_UNAVAILABLE_CODES.includes(error.status)
          ? Promise.resolve([])
          : Promise.reject(error),
      );
  }

  getPccIpAddressesDetails(serviceName) {
    return this.OvhApiDedicatedCloud.Ip()
      .v6()
      .query({
        serviceName,
      })
      .$promise.then((ipAddresses) =>
        this.$q
          .all(
            ipAddresses.map(
              (ipAddress) =>
                this.OvhApiDedicatedCloud.Ip()
                  .Details()
                  .v6()
                  .get({
                    serviceName,
                    network: ipAddress,
                  }).$promise,
            ),
          )
          .then((ipAddressesDetails) => flatten(ipAddressesDetails)),
      );
  }

  getZertoState({ serviceName, datacenterId }) {
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zerto/status`,
      )
      .then(({ data }) => ({ ...data, serviceName, datacenterId }));
  }

  getDefaultLocalVraNetwork(serviceInformations) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .Zerto()
      .Single()
      .v6()
      .getDefaultLocalVraNetwork(serviceInformations)
      .$promise.then(
        ({ value: defaultLocalVraNetwork }) => defaultLocalVraNetwork,
      );
  }

  /* ---- END Information Getters ---- */

  /* ================================= */
  /*          PCC Legacy Ovh           */
  /* ================================= */

  enableZerto(zertoInformations, isLegacy) {
    const isOvhToOvhPlan =
      zertoInformations.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh;

    if (!isLegacy) {
      return isOvhToOvhPlan
        ? this.enableZertoOvh(zertoInformations)
        : this.enableZertoOnPremise(zertoInformations);
    }

    return isOvhToOvhPlan
      ? this.enableZertoOvhLegacy(zertoInformations)
      : this.enableZertoOnPremiseLegacy(zertoInformations);
  }

  enableZertoOvhLegacy({
    primaryPcc,
    primaryDatacenter,
    primaryEndpointIp,
    secondaryPcc,
    secondaryDatacenter,
    secondaryEndpointIp,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .Zerto()
      .v6()
      .enable(
        {
          serviceName: primaryPcc.serviceName,
          datacenterId: primaryDatacenter.id,
        },
        {
          primaryEndpointIp,
          secondaryServiceName: secondaryPcc.serviceName,
          secondaryDatacenterId: secondaryDatacenter.id,
          secondaryEndpointIp,
        },
      ).$promise;
  }

  enableZertoOnPremiseLegacy({
    primaryPcc,
    primaryDatacenter,
    localVraNetwork,
    primaryEndpointIp: ovhEndpointIp,
    remoteVraNetwork,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .Zerto()
      .Single()
      .v6()
      .enable(
        {
          serviceName: primaryPcc.serviceName,
          datacenterId: primaryDatacenter.id,
        },
        {
          localVraNetwork,
          ovhEndpointIp,
          remoteVraNetwork,
        },
      ).$promise;
  }

  /* ------ END PCC Legacy OVH ------- */

  /* ================================= */
  /*        Order ZERTO option         */
  /* ================================= */

  enableZertoOvh(zertoInformations) {
    return this.orderZertoOption(
      zertoInformations,
      DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh,
    );
  }

  enableZertoOnPremise(zertoInformations) {
    return this.orderZertoOption(
      zertoInformations,
      DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.onPremise,
    );
  }

  createZertoOptionCart(zertoInformations, zertoOption) {
    let zertoCartId;
    return this.OvhApiOrder.Cart()
      .v6()
      .post({}, { ovhSubsidiary: this.coreConfig.getUser().ovhSubsidiary })
      .$promise.then(({ cartId }) => {
        zertoCartId = cartId;
        return this.OvhApiOrder.Cart()
          .v6()
          .assign({ cartId }).$promise;
      })
      .then(
        () =>
          this.OvhApiOrder.Cart()
            .ServiceOption()
            .v6()
            .get({
              productName:
                DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
              serviceName: zertoInformations.primaryPcc.serviceName,
            }).$promise,
      )
      .then((offers) => {
        const productName = get(
          DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoProductName,
          zertoOption,
        );
        const offer = find(offers, { productName });
        const [firstPrice] = offer.prices;

        return this.OvhApiOrder.Cart()
          .ServiceOption()
          .v6()
          .post(
            {
              productName:
                DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.productName,
              serviceName: zertoInformations.primaryPcc.serviceName,
            },
            {
              cartId: zertoCartId,
              duration: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.duration,
              planCode: get(offer, 'planCode', zertoOption),
              pricingMode: firstPrice.pricingMode,
              quantity: DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.quantity,
            },
          ).$promise;
      });
  }

  validateZertoOptionCart(cartId) {
    let autoPayWithPreferredPaymentMethod = false;
    return this.ovhPaymentMethod
      .getPaymentMethods({
        onlyValid: true,
        transform: true,
      })
      .then((allPaymentMethods) => {
        autoPayWithPreferredPaymentMethod = allPaymentMethods.some(
          (paymentMethod) => !!paymentMethod.default,
        );

        return this.OvhApiOrder.Cart()
          .v6()
          .checkout(
            {
              cartId,
            },
            {
              autoPayWithPreferredPaymentMethod,
              waiveRetractationPeriod: false,
            },
          ).$promise;
      })
      .then(({ orderId, url }) => ({
        hasAutoPay: autoPayWithPreferredPaymentMethod,
        orderId,
        url,
      }));
  }

  orderZertoOption(zertoInformations, zertoOption) {
    let zertoCartId;
    return this.createZertoOptionCart(zertoInformations, zertoOption)
      .then(({ cartId, itemId }) => {
        zertoCartId = cartId;
        return this.addCartZertoOptionConfiguration(
          cartId,
          itemId,
          this.constructor.getZertoConfiguration(
            zertoInformations,
            zertoOption,
          ),
        );
      })
      .then(() => this.validateZertoOptionCart(zertoCartId));
  }

  addCartZertoOptionConfiguration(cartId, itemId, zertoInformations) {
    const parametersToSet = keys(zertoInformations);

    return this.$q.all(
      parametersToSet.map(
        (parameter) =>
          this.OvhApiOrder.Cart()
            .Item()
            .Configuration()
            .v6()
            .post({
              cartId,
              itemId,
              label: parameter,
              value: get(zertoInformations, parameter),
            }).$promise,
      ),
    );
  }

  checkForZertoOptionOrder(pccId) {
    let storedZertoOption;

    const preferenceKey = this.constructor.formatPreferenceKey(
      pccId,
      DEDICATEDCLOUD_DATACENTER_ZERTO.title,
    );

    return this.ovhUserPref
      .getValue(preferenceKey)
      .then((preference) => {
        const { zertoInformations, zertoOptionOrderId } = preference;
        if (
          zertoInformations != null &&
          zertoInformations.primaryPcc.serviceName === pccId
        ) {
          storedZertoOption = zertoInformations;
          return this.getZertoOptionOrderStatus(zertoOptionOrderId);
        }

        return Promise.resolve({});
      })
      .then(({ status: zertoOrderStatus }) => {
        const pendingOrderStatus = [
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
        ].find((status) => status === zertoOrderStatus);

        return pendingOrderStatus != null
          ? { ...storedZertoOption, state: pendingOrderStatus }
          : Promise.resolve(null);
      })
      .catch((error) =>
        error.status === 404 ? Promise.resolve(null) : Promise.reject(error),
      );
  }

  getZertoOptionOrderStatus(orderId) {
    return this.OvhApiMe.Order()
      .v6()
      .getStatus({ orderId }).$promise;
  }

  storeZertoOptionOrderInUserPref(zertoInformations, enableZerto) {
    const zertoInformationsToStore = {
      zertoInformations,
      zertoOptionOrderId: enableZerto.orderId,
      zertoOption:
        zertoInformations.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
          ? DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
          : DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.onPremise,
    };

    const preferenceKey = this.constructor.formatPreferenceKey(
      zertoInformations.primaryPcc.serviceName,
      DEDICATEDCLOUD_DATACENTER_ZERTO.title,
    );

    return this.ovhUserPref.create(
      preferenceKey,
      JSON.stringify(zertoInformationsToStore),
    );
  }

  deleteZertoOptionOrderInUserPref(pccId) {
    const preferenceKey = this.constructor.formatPreferenceKey(
      pccId,
      DEDICATEDCLOUD_DATACENTER_ZERTO.title,
    );

    return this.ovhUserPref.remove(preferenceKey, true);
  }

  /* ------- Order ZERTO option ------ */

  disableZerto(zertoInformations) {
    const zertoPccId = zertoInformations.primaryPcc.serviceName;

    return (zertoInformations.drpType ===
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
      ? this.disableZertoOvh(zertoInformations)
      : this.disableZertoOnPremise(zertoInformations)
    ).then(() =>
      this.$q.allSettled([
        this.deleteZertoOptionOrderInUserPref(zertoPccId),
        this.deleteDisableSuccessAlertPreference(zertoPccId),
      ]),
    );
  }

  disableZertoOvh({
    primaryPcc,
    primaryDatacenter,
    secondaryPcc,
    secondaryDatacenter,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .Zerto()
      .v6()
      .disable(
        {
          serviceName: primaryPcc.serviceName,
          datacenterId: primaryDatacenter.id,
        },
        {
          secondaryServiceName: secondaryPcc.serviceName,
          secondaryDatacenterId: secondaryDatacenter.id,
        },
      ).$promise;
  }

  disableZertoOnPremise({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .Zerto()
      .Single()
      .v6()
      .disable(
        {
          serviceName: primaryPcc.serviceName,
          datacenterId: primaryDatacenter.id,
        },
        null,
      ).$promise;
  }

  regenerateZsspPassword({ primaryPcc, primaryDatacenter }) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .Zerto()
      .v6()
      .generateZsspPassword(
        {
          serviceName: primaryPcc.serviceName,
          datacenterId: primaryDatacenter.id,
        },
        null,
      ).$promise;
  }

  configureVpn({
    primaryPcc,
    primaryDatacenter,
    remoteVraNetwork,
    vpnConfiguration,
  }) {
    return this.OvhApiDedicatedCloud.Datacenter()
      .Zerto()
      .Single()
      .v6()
      .configureVpn(
        {
          serviceName: primaryPcc.serviceName,
          datacenterId: primaryDatacenter.id,
        },
        {
          preSharedKey: vpnConfiguration.preSharedKey,
          remoteEndpointInternalIp: vpnConfiguration.remoteEndpointInternalIp,
          remoteEndpointPublicIp: vpnConfiguration.remoteEndpointPublicIp,
          remoteVraNetwork,
          remoteZvmInternalIp: vpnConfiguration.remoteZvmInternalIp,
        },
      ).$promise;
  }

  getDisableSuccessAlertPreference(pccId) {
    const preferenceKey = this.constructor.formatPreferenceKey(
      pccId,
      DEDICATEDCLOUD_DATACENTER_ZERTO.alertPreference,
    );

    return this.ovhUserPref.getValue(preferenceKey);
  }

  setDisableSuccessAlertPreference(pccId, value) {
    const preferenceKey = this.constructor.formatPreferenceKey(
      pccId,
      DEDICATEDCLOUD_DATACENTER_ZERTO.alertPreference,
    );

    return this.ovhUserPref.create(preferenceKey, value);
  }

  deleteDisableSuccessAlertPreference(pccId) {
    const preferenceKey = this.constructor.formatPreferenceKey(
      pccId,
      DEDICATEDCLOUD_DATACENTER_ZERTO.alertPreference,
    );

    return this.ovhUserPref.remove(preferenceKey, true);
  }

  // It's near `formatPlanInformations`. Should be refactorised (See: MANAGER-19360)
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
    const preferenceKey = `${keyPreference}_${formattedServiceName.replace(
      /-/g,
      '',
    )}`;

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

  static getZertoConfiguration(zertoInformations, zertoOption) {
    return zertoOption ===
      DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
      ? {
          datacenter_id: zertoInformations.primaryDatacenter.id,
          primaryEndpointIp: zertoInformations.primaryEndpointIp,
          secondaryEndpointIp: zertoInformations.secondaryEndpointIp,
          secondaryServiceName: zertoInformations.secondaryPcc.serviceName,
          secondaryDatacenterId: zertoInformations.secondaryDatacenter.id,
        }
      : {
          datacenter_id: zertoInformations.primaryDatacenter.id,
          ovhEndpointIp: zertoInformations.ovhEndpointIp,
          localVraNetwork: zertoInformations.localVraNetwork,
          remoteVraNetwork: zertoInformations.remoteVraNetwork,
        };
  }

  static isZertoActionPossible(currentZerto) {
    return (
      [
        DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
        DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
        DEDICATEDCLOUD_DATACENTER_DRP_STATUS.waitingConfiguration,
      ].includes(currentZerto.state) &&
      currentZerto.vpnStatus !==
        DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configuring
    );
  }

  static isZertoNotInValidState(state) {
    return [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.error,
      DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.error,
      DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.notConfigured,
    ].includes(state);
  }

  static isZertoInChangingState(state) {
    return [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
      DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configuring,
    ].includes(state);
  }

  static isZertoInValidState(state) {
    return state === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;
  }

  getZertoMultiSite({ serviceName, datacenterId }) {
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/remoteSites`,
      )
      .then(({ data }) => data);
  }

  addZertoSite({ serviceName, datacenterId }, payload) {
    return this.$http
      .post(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/remoteSites`,
        payload,
      )
      .then(({ data }) => data);
  }

  deleteZertoRemoteSite({ serviceName, datacenterId, siteId }) {
    return this.$http.delete(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/disasterRecovery/zertoSingle/remoteSites?id=${siteId}`,
    );
  }

  static buildZertoInformations(
    serviceName,
    datacenter,
    zerto,
    datacenterHosts,
    storedZertoInformations = null,
  ) {
    const zertoInformations = {
      hasDatacenterWithoutHosts: datacenterHosts.length === 0,
    };

    if (DedicatedCloudDatacenterZertoService.getIsDisablingZerto(zerto.state)) {
      return null;
    }

    const otherZertoInformations = DedicatedCloudDatacenterZertoService.getIsDeliveredOrDelivering(
      zerto.state,
    )
      ? DedicatedCloudDatacenterZertoService.formatPlanInformations(
          serviceName,
          datacenter,
          zerto,
        )
      : storedZertoInformations;

    return {
      ...zertoInformations,
      ...(otherZertoInformations || {}),
    };
  }

  // It's near `getPlanServiceInformations`. Should be refactorised (See: MANAGER-19360)
  static formatPlanInformations(
    serviceName,
    datacenter,
    { drpType, localSiteInformation, remoteSiteInformation, state },
  ) {
    let primaryPcc;
    let primaryDatacenter;
    let secondaryPcc;
    let secondaryDatacenter;
    let vpnConfiguration;

    if (localSiteInformation && remoteSiteInformation) {
      switch (localSiteInformation.role) {
        case DEDICATEDCLOUD_DATACENTER_DRP_ROLES.primary:
          primaryPcc = {
            serviceName,
          };
          primaryDatacenter = {
            id: datacenter.id,
            displayName: datacenter.displayName,
          };
          secondaryPcc = {
            serviceName,
          };
          secondaryDatacenter = {
            id: remoteSiteInformation.datacenterId,
            displayName: remoteSiteInformation.datacenterName,
          };
          break;
        case DEDICATEDCLOUD_DATACENTER_DRP_ROLES.single:
          primaryPcc = {
            serviceName,
          };
          primaryDatacenter = {
            id: datacenter.id,
            displayName: datacenter.displayName,
          };
          vpnConfiguration = remoteSiteInformation;
          break;
        default:
          primaryPcc = {
            serviceName: remoteSiteInformation.serviceName,
          };
          primaryDatacenter = {
            id: remoteSiteInformation.datacenterId,
            displayName: remoteSiteInformation.datacenterName,
          };
          secondaryPcc = {
            serviceName,
          };
          secondaryDatacenter = {
            id: datacenter.id,
            displayName: datacenter.displayName,
          };
          break;
      }
    }

    return {
      drpType,
      state,
      primaryPcc,
      primaryDatacenter,
      secondaryPcc,
      secondaryDatacenter,
      vpnConfiguration,
    };
  }

  static getIsDeliveredOrDelivering(state) {
    return [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
    ].includes(state);
  }

  static getIsDisablingZerto(zertoState) {
    return [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
    ].includes(zertoState);
  }
}

angular
  .module(moduleName, [])
  .service('dedicatedCloudZerto', DedicatedCloudDatacenterZertoService);

export default moduleName;
