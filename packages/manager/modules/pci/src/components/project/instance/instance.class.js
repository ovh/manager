import filter from 'lodash/filter';
import first from 'lodash/first';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';

import { CAPABILITIES } from './instance.constants';
import Flavor from '../flavors-list/flavor.class';

export default class Instance {
  constructor(resource) {
    Object.assign(this, resource);
  }

  canAddSnapshot() {
    return this.isCapabilityEnabled(CAPABILITIES.SNAPSHOT);
  }

  canAttachIPFO() {
    return this.isCapabilityEnabled(CAPABILITIES.FAIL_OVER_IP);
  }

  canAttachVolume() {
    return this.isCapabilityEnabled(CAPABILITIES.VOLUME);
  }

  canBeResized() {
    return this.isCapabilityEnabled(CAPABILITIES.RESIZE);
  }

  get statusGroup() {
    if (
      includes(
        [
          'BUILDING',
          'REBOOT',
          'REBUILD',
          'REVERT_RESIZE',
          'SOFT_DELETED',
          'VERIFY_RESIZE',
          'MIGRATING',
          'RESIZE',
          'BUILD',
          'SHUTOFF',
          'RESCUE',
          'SHELVED',
          'SHELVED_OFFLOADED',
          'RESCUING',
          'UNRESCUING',
          'SNAPSHOTTING',
          'RESUMING',
          'HARD_REBOOT',
          'PASSWORD',
          'PAUSED',
        ],
        this.status,
      )
    ) {
      return 'PENDING';
    }

    if (
      includes(
        ['DELETED', 'ERROR', 'STOPPED', 'SUSPENDED', 'UNKNOWN'],
        this.status,
      )
    ) {
      return 'ERROR';
    }

    if (includes(['ACTIVE', 'RESCUED', 'RESIZED'], this.status)) {
      return 'ACTIVE';
    }

    return this.status.toUpperCase();
  }

  isPendingState() {
    return includes(
      [
        'BUILD',
        'BUILDING',
        'REBUILD',
        'DELETING',
        'RESIZE',
        'VERIFY_RESIZE',
        'REVERT_RESIZE',
        'MIGRATING',
        'REBOOT',
        'HARD_REBOOT',
        'RESCUING',
        'UNRESCUING',
        'SNAPSHOTTING',
        'RESUMING',
      ],
      this.status,
    );
  }

  isOpenStackState() {
    return includes(
      ['PAUSED', 'STOPPED', 'SUSPENDED', 'SHUTOFF', 'RESCUE'],
      this.status,
    );
  }

  hasPublicIpV4() {
    return this.publicIpV4.length > 0;
  }

  get publicIpV4() {
    return filter(
      this.ipAddresses,
      (ipAddress) => ipAddress.type === 'public' && ipAddress.version === 4,
    );
  }

  get privateIpV4() {
    return filter(
      this.ipAddresses,
      (ipAddress) => ipAddress.type === 'private' && ipAddress.version === 4,
    );
  }

  hasPublicIpV6() {
    return this.publicIpV6.length > 0;
  }

  get publicIpV6() {
    return filter(
      this.ipAddresses,
      (ipAddress) => ipAddress.type === 'public' && ipAddress.version === 6,
    );
  }

  isMonthlyBillingEnabled() {
    return (
      isObject(this.monthlyBilling) &&
      get(this.monthlyBilling, 'status') === 'ok'
    );
  }

  isMonthlyBillingPending() {
    return (
      isObject(this.monthlyBilling) &&
      get(this.monthlyBilling, 'status') === 'activationPending'
    );
  }

  isMonthlyBillingActivated() {
    return this.isMonthlyBillingEnabled() || this.isMonthlyBillingPending();
  }

  isRescuableWithDefaultImage() {
    return !includes(['freebsd', 'windows'], get(this.image, 'distribution'));
  }

  isCapabilityEnabled(capability) {
    return get(this.flavor, `capabilities.${capability}`, true);
  }

  get connectionInfos() {
    const user = get(this, 'image.user') || 'user';
    const ip = this.getDefaultIp();
    return get(this, 'image.type') === 'windows'
      ? `rdekstop ${ip}`
      : `ssh ${user}@${ip}`;
  }

  isApplicationImage() {
    return includes(get(this, 'image.tags', []), 'application');
  }

  getDefaultIp() {
    if (this.hasPublicIpV4()) {
      return first(this.publicIpV4).ip;
    }
    if (this.hasPublicIpV6()) {
      return first(this.publicIpV6).ip;
    }
    return 'X.X.X.X';
  }

  canBeHardRebooted() {
    return ['ACTIVE', 'SHUTOFF'].includes(this.status);
  }

  isFlavorType(type) {
    return new Flavor(this.flavor || {}).isType(type);
  }

  /**
   * Tell if instance is currently in deleting status.
   * Based on: cloud.instance.InstanceStatusEnum
   *
   * @return {Boolean}
   */
  isDeleting() {
    return this.status === 'DELETING';
  }
}
