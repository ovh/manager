import { RENEW_STATES_BADGES_CLASSES_MAP } from './renew-status.constants';

export default class {
  constructor() {
    this.RENEW_STATES_BADGES_CLASSES_MAP = RENEW_STATES_BADGES_CLASSES_MAP;
  }

  shouldHideAutorenewStatus() {
    return (
      this.service.isOneShot?.() || ['SMS'].includes(this.service.serviceType)
    );
  }
}
