import find from 'lodash/find';
import remove from 'lodash/remove';

import { STATUS } from './cloud-connect.constants';
import CloudConnectDatacenterExtra from './cloud-connect-datacenter-extra.class';

export default class CloudConnectDatacenter {
  constructor({ datacenterId, dcName, id, ovhBgpArea, status, subnet }) {
    Object.assign(this, {
      datacenterId,
      dcName,
      id,
      ovhBgpArea,
      status,
      subnet,
    });
    this.loadingExtraConf = false;
    this.extraConf = [];
  }

  isActive() {
    return this.status === STATUS.ACTIVE;
  }

  setActive() {
    this.status = STATUS.ACTIVE;
  }

  setDeleting() {
    this.status = STATUS.TO_DELETE;
  }

  isInProcess() {
    return this.status === STATUS.INIT || this.status === STATUS.TO_DELETE;
  }

  isError() {
    return this.status === STATUS.ERROR;
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
    remove(this.extraConf, (extra) => extra.id === parseInt(extraId, 10));
  }

  getExtraConfiguration(extraId) {
    return find(this.extraConf, (extra) => extra.id === parseInt(extraId, 10));
  }

  addExtraConfiguration(extra) {
    this.extraConf.push(extra);
  }

  getFirstExtraConfiguration() {
    return this.getExtraConfigurations()[0];
  }

  static createExtraConfiguration(extra) {
    return new CloudConnectDatacenterExtra(extra);
  }
}
