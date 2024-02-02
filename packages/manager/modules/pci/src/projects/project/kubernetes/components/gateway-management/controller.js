import { GATEWAY_IP_REGEX } from './constants';

export default class {
  constructor() {
    this.GATEWAY_IP_REGEX = GATEWAY_IP_REGEX;
  }

  onGatewayChanged() {
    if (!this.network.gateway.enabled) {
      delete this.network.gateway.ip;
    }
  }
}
