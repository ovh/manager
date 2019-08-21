import { FROM } from './message.constants';

export default class {
  constructor(message) {
    Object.assign(this, message);
  }

  isFromCustomer() {
    return this.from.value === FROM.customer;
  }

  isFromSupport() {
    return this.from.value === FROM.support;
  }
}
