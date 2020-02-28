import capitalize from 'lodash/capitalize';

export default class SupportTicket {
  constructor(ticket) {
    Object.assign(this, ticket);
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
}
