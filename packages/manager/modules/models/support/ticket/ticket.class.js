import capitalize from 'lodash/capitalize';
import { STATUS } from './ticket.constants';

export default class {
  constructor(ticket) {
    Object.assign(this, ticket);
  }

  static get Status() {
    return { ...STATUS };
  }

  getDisplayName() {
    return capitalize(this.serviceName);
  }

  getStateCategory() {
    switch (this.state) {
      case 'open':
        return 'success';
      case 'closed':
        return 'info';
      case 'unknown':
        return 'warning';
      default:
        return 'error';
    }
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
