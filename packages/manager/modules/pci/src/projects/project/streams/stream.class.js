import find from 'lodash/find';

import { KIND, STATUS, THROTTLING } from './streams.constants';

export default class Stream {
  constructor({
    backlog,
    description,
    id,
    kind,
    name,
    regions,
    retention,
    status,
    throttling,
    stats,
    region,
    tokens,
  }) {
    Object.assign(this, {
      backlog,
      description,
      id,
      kind,
      name,
      regions,
      retention,
      status,
      throttling,
      stats,
      region,
      tokens,
    });
  }

  isInstalling() {
    return this.status === STATUS.INSTALLING;
  }

  isRunning() {
    return this.status === STATUS.RUNNING;
  }

  isInError() {
    return this.status === STATUS.ERROR;
  }

  isPersistent() {
    return this.kind === KIND.PERSISTENT;
  }

  isNonPersistent() {
    return this.kind === KIND.NON_PERSISTENT;
  }

  getStreamUrl({ project_id: projectId }) {
    return `${
      this.isPersistent() ? 'persistent' : 'non-persistent'
    }://${projectId}/${this.name}/${this.name}`;
  }

  get consumerAndPublisherToken() {
    return find(this.tokens, (token) => token.isProducerAndConsumer());
  }

  get consumerOnlyToken() {
    return find(this.tokens, (token) => token.isConsumerOnly());
  }

  isUnlimitedThrottling() {
    return this.throttling === THROTTLING.UNLIMITED;
  }

  getBacklogAsHours() {
    return moment.duration(this.backlog).asHours();
  }

  getRetentionAsHours() {
    return moment.duration(this.retention).asHours();
  }

  setBacklogFromHours(hours) {
    this.backlog = moment.duration(hours, 'hours').toISOString();
  }

  setRetentionFromHours(hours) {
    this.retention = moment.duration(hours, 'hours').toISOString();
  }
}
