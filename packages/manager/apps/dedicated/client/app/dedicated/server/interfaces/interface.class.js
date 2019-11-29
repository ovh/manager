import isEmpty from 'lodash/isEmpty';

import { PHYSICAL_TYPE, VIRTUAL_TYPE } from './interfaces.constants';

export default class Interface {
  constructor({
    id,
    name,
    mac,
    type,
    virtualNetworkInterface,
    vrack,
    enabled,
    uuid,
  }) {
    Object.assign(this, {
      id,
      name,
      mac,
      type,
      virtualNetworkInterface,
      vrack,
      enabled,
      uuid,
    });
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
    return [PHYSICAL_TYPE.public, VIRTUAL_TYPE.public].includes(this.type);
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
    return this.vrack;
  }

  isLegacy() {
    return !this.virtualNetworkInterface && !this.uuid;
  }
}
