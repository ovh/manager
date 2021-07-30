// TODO: Remove constant and use api to get service limit when endpoint is available
const MAXIMUM_VOLUME_LIMIT = 50;

export default class NetApp {
  constructor({ id, name, performanceLevel, quota, region, status }) {
    Object.assign(this, {
      id,
      name,
      performanceLevel,
      quota,
      region,
      status,
      maximumVolumesLimit: MAXIMUM_VOLUME_LIMIT,
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
