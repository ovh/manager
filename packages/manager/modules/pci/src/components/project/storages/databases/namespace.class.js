import Retention from './retention.class';

export default class Namespace {
  constructor({
    id,
    name,
    resolution,
    retention,
    snapshotEnabled,
    type,
    writesToCommitLogEnabled,
  }) {
    Object.assign(this, {
      id,
      name,
      resolution,
      retention: new Retention(retention),
      snapshotEnabled,
      type,
      writesToCommitLogEnabled,
    });
  }

  isDefault() {
    return this.name === 'default';
  }

  getRetentionTimeDuration() {
    return this.retention.periodDuration
      ? moment.duration(this.retention.periodDuration)
      : null;
  }

  getResolutionDuration() {
    return this.resolution ? moment.duration(this.resolution) : null;
  }
}
