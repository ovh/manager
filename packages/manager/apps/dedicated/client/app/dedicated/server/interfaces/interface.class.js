import isEmpty from 'lodash/isEmpty';

import { PHYSICAL_TYPE, VIRTUAL_TYPE } from './interfaces.constants';

export default class Interface {
  constructor(resource) {
    Object.assign(this, resource);
    this.taskInProgress = false;
  }

  isPhysical() {
    return [
      PHYSICAL_TYPE.public,
      PHYSICAL_TYPE.private,
      PHYSICAL_TYPE.privateLag,
    ].includes(this.type);
  }

  isVirtual() {
    return !this.isPhysical();
  }

  isPublic() {
    return [
      PHYSICAL_TYPE.public,
      VIRTUAL_TYPE.public,
      VIRTUAL_TYPE.publicAggregation,
    ].includes(this.type);
  }

  isPrivate() {
    return [
      PHYSICAL_TYPE.private,
      PHYSICAL_TYPE.privateLag,
      VIRTUAL_TYPE.vrack,
      VIRTUAL_TYPE.vrackAggregation,
    ].includes(this.type);
  }

  hasFailoverIps() {
    return !isEmpty(this.failoverIps);
  }

  hasVrack() {
    return this.vrack !== null;
  }

  setVrack(vrack) {
    this.vrack = vrack;
  }

  hasTaskInProgress() {
    return !!this.taskInProgress;
  }

  setTaskInProgress(progress) {
    this.taskInProgress = progress;
  }
}
