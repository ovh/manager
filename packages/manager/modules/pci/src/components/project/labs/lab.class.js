import includes from 'lodash/includes';
import filter from 'lodash/filter';

import { STATUS } from './labs.constants';

export default class Lab {
  constructor({ id, name, status, agreements, contracts }) {
    Object.assign(this, {
      id,
      name,
      status,
      agreements,
      contracts,
    });
  }

  isOpen() {
    return this.status === STATUS.OPEN;
  }

  isActivating() {
    return this.status === STATUS.ACTIVATING;
  }

  isActivated() {
    return this.status === STATUS.ACTIVATED;
  }

  isClosed() {
    return this.status === STATUS.CLOSED;
  }

  get toAcceptContracts() {
    return filter(this.contracts, ({ id }) =>
      includes(this.agreements.toAccept, id),
    );
  }

  get acceptedContracts() {
    return filter(this.contracts, ({ id }) =>
      includes(this.agreements.accepted, id),
    );
  }
}
