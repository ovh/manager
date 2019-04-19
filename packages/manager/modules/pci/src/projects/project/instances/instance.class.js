import filter from 'lodash/filter';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isObject from 'lodash/isObject';

export default class Instance {
  constructor(resource) {
    Object.assign(this, resource);
  }

  get statusGroup() {
    if (includes(
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
      || (this.status === 'ACTIVE' && this.isMonthlyBillingPending())
    ) {
      return 'PENDING';
    }

    if (includes(
      [
        'DELETED',
        'ERROR',
        'STOPPED',
        'SUSPENDED',
        'UNKNOWN',
      ],
      this.status,
    )) {
      return 'ERROR';
    }

    if (includes(
      [
        'ACTIVE',
        'RESCUED',
        'RESIZED',
      ],
      this.status,
    )) {
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
      [
        'PAUSED',
        'STOPPED',
        'SUSPENDED',
        'SHUTOFF',
        'RESCUE',
      ],
      this.status,
    );
  }

  get publicIpV4() {
    return filter(this.ipAddresses, ipAddress => ipAddress.type === 'public' && ipAddress.version === 4);
  }

  get privateIpV4() {
    return filter(this.ipAddresses, ipAddress => ipAddress.type === 'private' && ipAddress.version === 4);
  }

  isMonthlyBillingEnabled() {
    return (isObject(this.monthlyBilling) && get(this.monthlyBilling, 'status') === 'ok');
  }

  isMonthlyBillingPending() {
    return (isObject(this.monthlyBilling) && get(this.monthlyBilling, 'status') === 'activationPending');
  }

  isRescuableWithDefaultImage() {
    return !includes(['freebsd', 'windows'], this.image.distribution);
  }
}
