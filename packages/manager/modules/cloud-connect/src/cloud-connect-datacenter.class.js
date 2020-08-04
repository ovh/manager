import find from 'lodash/find';
import remove from 'lodash/remove';

import CloudConnectDatacenterExtra from './cloud-connect-datacenter-extra.class';

export default class CloudConnectDatacenter {
  constructor(datacenterConfiguration) {
    Object.assign(this, datacenterConfiguration);
    this.loadingExtraConf = false;
    this.extraConf = [];
  }

  isActive() {
    return this.status === 'active';
  }

  setActive() {
    this.status = 'active';
  }

  setDeleting() {
    this.status = 'toDelete';
  }

  isInProcess() {
    return this.status === 'init' || this.status === 'toDelete';
  }

  isError() {
    return this.status === 'error';
  }

  setLoadingExtraConfigurations(loading) {
    this.loadingExtraConf = loading;
  }

  isLoadingExtraConfigurations() {
    return this.loadingExtraConf;
  }

  setExtraConfigurations(extra) {
    this.extraConf = extra || [];
    this.extraType = extra[0] ? extra[0].type : null;
  }

  getExtraConfigurations() {
    return this.extraConf || [];
  }

  removeExtraConfiguration(extraId) {
    remove(this.extraConf, (extra) => extra.id === extraId);
  }

  getExtraConfiguration(extraId) {
    return find(this.extraConf, (extra) => extra.id === extraId);
  }

  addExtraConfiguration(extra) {
    this.extraConf.push(extra);
  }

  createExtraConfiguration(extra) {
    return new CloudConnectDatacenterExtra(extra);
  }
}
