import Retention from './retention.class';

export default class Namespace {
  constructor({
    id,
    name,
    resolution,
    retention,
    snapshotEnabled,
    type,
    writesToCommitlogEnabled,
  }) {
    Object.assign(this, {
      id,
      name,
      resolution,
      retention: new Retention(retention),
      snapshotEnabled,
      type,
      writesToCommitlogEnabled,
    });
    this.default = this.name === 'default';
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
