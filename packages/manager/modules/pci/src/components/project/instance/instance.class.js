import filter from 'lodash/filter';
import first from 'lodash/first';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';

import { CAPABILITIES, INSTANCE_STATUS } from './instance.constants';
import Flavor from '../flavors-list/flavor.class';
import { IMAGE_STATUS } from '../image/image.constants';

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
    return this.isStarted() && this.isCapabilityEnabled(CAPABILITIES.VOLUME);
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
      ? `rdesktop ${ip}`
      : `ssh ${user}@${ip}`;
  }

  isApplicationImage() {
    return includes(get(this, 'image.tags', []), 'application');
  }

  isDeprecatedImage() {
    return this.image?.status === IMAGE_STATUS.DEPRECATED;
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

  /**
   * Check if current instance is running
   * @returns {boolean}: true if active, otherwise false
   */
  isStarted() {
    return this.status === 'ACTIVE';
  }

  /**
   * check if current instance can be started
   * @returns {boolean}: true if can started, otherwise false
   */
  canBeStarted() {
    return !this.isStarted() && this.canBeShelved();
  }

  /**
   * check if current instance is shutoff
   * @returns {boolean}: true if shutoff, otherwise false
   */
  isStopped() {
    return this.status === 'SHUTOFF';
  }

  /**
   * check if current instance can be stopped
   * @returns {boolean}: true if can stopped, otherwise false
   */
  canBeStopped() {
    return !this.isStopped() && this.canBeShelved();
  }

  /**
   * check is current instance is shelved
   * @returns {boolean}: true if status is shelved, otherwise false
   */
  isShelved() {
    return [
      INSTANCE_STATUS.SHELVED,
      INSTANCE_STATUS.SHELVED_OFFLOADED,
    ].includes(this.status);
  }

  /**
   * check if current instance is in shelve process
   * @returns {boolean}: true is status is shelving, otherwise false
   */
  isShelving() {
    return this.status === INSTANCE_STATUS.SHELVING;
  }

  /**
   * check if current instance is in unshelve process
   * @returns {boolean}: true is status is unshelving, otherwise false
   */
  isUnshelving() {
    return this.status === INSTANCE_STATUS.UNSHELVING;
  }

  /**
   * check if current instance is in shelve/unshelve process
   * @returns {boolean}: true if status is shelving/unshelving status, otherwise false
   */
  isShelvingOrUnshelving() {
    return this.isShelving() || this.isUnshelving();
  }

  /**
   * check if current instance can be shelved
   * @returns {boolean}: true if not shelved and not inprogress shelve/unshelve process, otherwise false
   */
  canBeShelved() {
    return !this.isShelved() && !this.isShelvingOrUnshelving();
  }

  /**
   * check if current instance can be unshelved
   * @returns {boolean}: true if shelved and not inprogress shelve/unshelve process, otherwise false
   */
  canBeUnshelved() {
    return this.isShelved() && !this.isShelvingOrUnshelving();
  }

  /**
   * check if we can create or schedule backup
   * @returns {boolean}:  true if snapshot and not inprogress shelve/unshelve process, otherwise false
   */
  canCreateOrScheduleBackup() {
    return this.canAddSnapshot() && !this.isShelvingOrUnshelving();
  }
}
