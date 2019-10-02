import find from 'lodash/find';

import { KIND, STATUS } from './streams.constants';

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

  isError() {
    return this.status === STATUS.ERROR;
  }

  isPersistent() {
    return this.kind === KIND.PERSISTENT;
  }

  isNonPersistent() {
    return this.kind === KIND.NON_PERSISTENT;
  }

  get streamUrl() {
    return `${this.isPersistent() ? 'persistent' : 'non-persistent'}://${this.id}/${this.name}/${this.name}`;
  }

  get consumerAndPublisherToken() {
    return find(this.tokens, token => token.isProducerAndConsumer());
  }

  get consumerOnlyToken() {
    return find(this.tokens, token => token.isConsumerOnly());
  }
}
