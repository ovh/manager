import { SERVICE_STATES } from './service-status.constants';

export default class {
  constructor() {
    this.SERVICE_STATES = SERVICE_STATES;
  }

  shouldHideAutorenewStatus() {
    return (
      this.service.isOneShot() || ['SMS'].includes(this.service.serviceType)
    );
  }
}
