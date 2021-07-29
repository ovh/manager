export default class NetApp {
  constructor({ id, name, performanceLevel, quota, region, status }) {
    Object.assign(this, {
      id,
      name,
      performanceLevel,
      quota,
      region,
      status,
    });
  }

  isActive() {
    return ['running'].includes(this.status);
  }

  isInactive() {
    return ['deleted', 'suspended'].includes(this.status);
  }

  isPending() {
    return ['creating', 'deleting', 'suspending', 'reopening'].includes(
      this.status,
    );
  }
}
