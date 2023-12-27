import {
  compact,
  find,
  head,
  isEmpty,
  map,
  remove,
  set,
  sortBy,
  values,
} from 'lodash';
import CloudConnectPop from './cloud-connect-pop.class';

import {
  POP_TYPE_CONSTANT,
  STATUS,
  CHANGE_BANDWIDTH_ALLOWED_OFFERS_REGEX,
} from './cloud-connect.constants';

export default class CloudConnect {
  constructor({
    bandwidth,
    description,
    interfaceList,
    pop,
    portQuantity,
    product,
    provider,
    status,
    uuid,
    vrack,
  }) {
    Object.assign(this, {
      bandwidth,
      description,
      interfaceList,
      pop,
      portQuantity,
      product,
      provider,
      status,
      uuid,
      vrack,
    });
    this.id = this.uuid;
    this.datacenterConfigurations = [];
    this.availableDatacenters = [];
    this.popConfiguration = {};
    this.interfaces = {};
    this.loadingPopConfiguration = false;
    this.loadingInterface = false;
    this.loadingServiceKeys = false;
    this.loadingDatacenterConfig = false;
    this.PROVIDER_OVH_CLOUD = 'OVHcloud';
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  isDirectService() {
    return this.provider === this.PROVIDER_OVH_CLOUD;
  }

  isVrackAssociated() {
    return !isEmpty(this.vrack);
  }

  setVrackName(name) {
    this.vrackName = name;
  }

  setProductName(name) {
    this.productName = name;
  }

  setPlanCode(code) {
    this.planCode = code;
  }

  getAllowedPopType() {
    if (this.isPopConfigurationExists()) {
      return head(values(this.popConfiguration));
    }
    return null;
  }

  isPopConfigured(interfaceId) {
    return (
      !isEmpty(this.popConfiguration) && this.popConfiguration[interfaceId]
    );
  }

  isPopConfigurationExists() {
    return !isEmpty(this.popConfiguration);
  }

  isLoadingPop() {
    return this.isLoadingPopConfiguration() || this.isLoadingInterface();
  }

  isLoadingPopConfiguration() {
    return this.loadingPopConfiguration;
  }

  setPopConfiguration(configuration) {
    if (configuration.interfaceId) {
      this.popType = configuration.type;
      this.popConfiguration[configuration.interfaceId] = new CloudConnectPop(
        configuration,
      );
    }
  }

  addPopConfiguration(configuration) {
    if (configuration.interfaceId) {
      this.popType = configuration.type;
      const popConfig = new CloudConnectPop(configuration);
      this.popConfiguration[configuration.interfaceId] = popConfig;
      return popConfig;
    }
    return false;
  }

  removePopConfiguration(interfaceId) {
    if (interfaceId && this.popConfiguration[interfaceId]) {
      this.popConfiguration[interfaceId] = null;
      delete this.popConfiguration[interfaceId];
    }
  }

  getPopConfiguration(interfaceId) {
    return this.popConfiguration[interfaceId];
  }

  getFirstPopConfiguration() {
    const pop = map(this.interfaceList, (id) => this.getPopConfiguration(id));
    return compact(pop)[0];
  }

  setLoadingPopConfiguration(loading) {
    this.loadingPopConfiguration = loading;
  }

  setDcConfigurations(configurations) {
    this.datacenterConfigurations = sortBy(configurations, ['dcName']) || [];
  }

  addDcConfiguration(dc) {
    map(this.availableDatacenters, (datacenter) => {
      if (datacenter.id === dc.datacenterId) {
        set(datacenter, 'available', false);
      }
    });
    this.datacenterConfigurations.push(dc);
  }

  removeDcConfiguration(dcId) {
    remove(this.datacenterConfigurations, (dc) => dc.id === parseInt(dcId, 10));
  }

  getDcConfiguration(dcId) {
    return find(this.datacenterConfigurations, { id: parseInt(dcId, 10) });
  }

  setLoadingServiceKeys(loading) {
    this.loadingServiceKeys = loading;
  }

  isLoadingServiceKeys() {
    return this.loadingServiceKeys;
  }

  setServiceKeys(serviceKeys) {
    this.validServiceKey = serviceKeys.some(({ status }) =>
      [STATUS.ACTIVE, STATUS.DOING, STATUS.TO_CHECK].includes(status),
    );
    this.serviceKeys = serviceKeys;
  }

  getServiceKeys() {
    return this.serviceKeys;
  }

  getActiveServiceKey() {
    return find(
      this.getServiceKeys(),
      (key) => key.status === STATUS.ACTIVE || key.status === STATUS.DOING,
    );
  }

  setInterface(interfaces) {
    map(interfaces, (item) => {
      if (item.id) {
        this.interfaces[item.id] = item;
      }
    });
  }

  getInterface(interfaceId) {
    return this.interfaces[interfaceId];
  }

  setLoadingInterface(loading) {
    this.loadingInterface = loading;
  }

  isLoadingInterface() {
    return this.loadingInterface;
  }

  setLoadingDatacenters(loading) {
    this.loadingDatacenterConfig = loading;
  }

  getDatacenterExtraType(id) {
    return find(this.datacenterConfigurations, { id: parseInt(id, 10) })
      .extraType;
  }

  setAvailableDatacenters(list) {
    this.availableDatacenters = sortBy(list, ['name']);
  }

  isL3PopType() {
    return this.popType === POP_TYPE_CONSTANT.L3;
  }

  canCreateDc() {
    return !find(
      this.datacenterConfigurations,
      (dc) => dc.status === STATUS.INIT,
    );
  }

  canChangeBandwidth() {
    return CHANGE_BANDWIDTH_ALLOWED_OFFERS_REGEX.test(this.planCode);
  }

  isPopDeleting() {
    let isPopDeleting = false;
    find(this.interfaceList, (id) => {
      const pop = this.getPopConfiguration(id);
      if (pop && pop.isDeleting()) {
        isPopDeleting = true;
      }
    });
    return isPopDeleting;
  }
}
