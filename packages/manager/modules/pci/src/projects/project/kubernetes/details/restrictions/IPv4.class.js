export default class IPv4 {
  constructor(ip) {
    const [cidr, mask] = ip.split('/');
    this.address = ip;
    this.cidr = cidr;
    this.mask = parseInt(mask, 10) || 32;
  }

  format() {
    return `${this.cidr}/${this.mask}`;
  }
}
