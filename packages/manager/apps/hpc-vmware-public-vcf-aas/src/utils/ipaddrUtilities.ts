import * as ipaddr from 'ipaddr.js';

// TODO this code should move to an other file done in ACL
export function getGatewayFromCIDR(cidr: string): string {
  const [, prefixLength] = cidr.split('/');
  const broadcast = ipaddr.IPv4.broadcastAddressFromCIDR(cidr);
  const octets = broadcast.octets.slice();

  for (let i = 3; i >= 0; i -= 1) {
    const currentOctet = octets[i];
    if (currentOctet !== undefined && currentOctet > 0) {
      octets[i] = currentOctet - 1;
      break;
    }
    octets[i] = 255;
  }

  return `${octets.join('.')}/${prefixLength}`;
}
