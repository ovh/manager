import { find, head, isEmpty, map, remove, set, sortBy, values } from 'lodash';
import CloudConnectPop from './cloud-connect-pop.class';

import { POP_TYPE_CONSTANT, STATUS } from './cloud-connect.constants';

export default class CloudConnect {
  constructor(cloudConnect) {
    set(cloudConnect, 'id', cloudConnect.uuid);
    Object.assign(this, cloudConnect);
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
    return this.getPopConfiguration(this.interfaceList[0]);
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
    if (find(serviceKeys, { status: STATUS.ACTIVE })) {
      set(this, 'validServiceKey', true);
    } else {
      set(this, 'validServiceKey', false);
    }
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

  setInterface(ccInterface) {
    if (ccInterface.id) {
      this.interfaces[ccInterface.id] = ccInterface;
    }
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
}
