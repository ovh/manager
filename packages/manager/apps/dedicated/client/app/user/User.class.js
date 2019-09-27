import { AUTORENEW_2016_SUBSIDIARIES } from './user.constants';

export default class {
  constructor(user) {
    Object.assign(this, user);
  }

  hasAutorenew2016() {
    return AUTORENEW_2016_SUBSIDIARIES.includes(this.ovhSubsidiary);
  }
}
