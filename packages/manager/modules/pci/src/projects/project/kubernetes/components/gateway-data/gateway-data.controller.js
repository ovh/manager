export default class PCIKubeGatewayDataController {
  get public() {
    return !this.gateway || !this.gateway.privateNetworkRoutingAsDefault;
  }

  get private() {
    return this.gateway?.privateNetworkRoutingAsDefault;
  }

  get ip() {
    return this.gateway?.defaultVrackGateway || '';
  }
}
