import { STATUS } from './ticket.constants';

export default class {
  constructor(ticket) {
    Object.assign(this, ticket);
  }

  isClosed() {
    return this.state.value === STATUS.closed;
  }

  isOpened() {
    return this.state.value === STATUS.open;
  }

  isStatusUnknown() {
    return this.state.value === STATUS.unknown;
  }
}
