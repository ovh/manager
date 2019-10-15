import { ACTIONS } from './tokens.constants';

export default class Stream {
  constructor({
    id,
    token,
    action,
  }) {
    Object.assign(this, {
      id,
      token,
      action,
    });
  }

  isProducerAndConsumer() {
    return this.action === ACTIONS.BOTH;
  }

  isProducerOnly() {
    return this.action === ACTIONS.PRODUCE;
  }

  isConsumerOnly() {
    return this.action === ACTIONS.CONSUME;
  }
}
