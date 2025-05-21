import ipaddr from 'ipaddr.js';
import { toASCII } from 'punycode';

export function isValidIpv4Block(block: string) {
  const split = block?.split('/');
  const range = parseInt(split[1], 10);
  return (
    split.length === 2 &&
    ipaddr.IPv4.isValid(split[0]) &&
    range > 0 &&
    range < 33
  );
}

export function isValidIpv6Block(block?: string) {
  const split = block?.split('/');
  const range = parseInt(split[1], 10);
  return (
    split.length === 2 &&
    ipaddr.IPv6.isValid(split[0]) &&
    range > 0 &&
    range < 129
  );
}

export function isIpInsideBlock(ipBlock: string, ip?: string) {
  try {
    return ipaddr.parse(ip)?.match(ipaddr.parseCIDR(ipBlock));
  } catch {
    return false;
  }
}

export type DomainOptions = {
  /**
   * specifics NDD can be like: _foo._bar.example.com
   */
  canBeginWithUnderscore?: boolean;
  /**
   * specifics NDD can be like: *.foo.bar.example.com
   */
  canBeginWithWildcard?: boolean;
};

export function isValidDomain(domain?: string, opts: DomainOptions = {}) {
  if (!domain) {
    return false;
  }

  const punycodeVersion = toASCII(domain.trim());
  const dotSplit = punycodeVersion.split('.');

  // Check lengths
  if (punycodeVersion.length > 255 || dotSplit.length < 2) {
    return false;
  }

  // Check wildcard
  if (
    ~punycodeVersion.indexOf('*') &&
    (opts.canBeginWithWildcard
      ? !/^(?:\*\.)[^*]+$/.test(punycodeVersion)
      : true)
  ) {
    return false;
  }

  // Check subdomain(s)
  if (
    dotSplit.some(
      (sub: string) =>
        sub.length > 63 ||
        /(?:(?:^\s*$)|(?:^-)|(?:-$))/.test(sub) ||
        (~sub.indexOf('_') &&
          (opts.canBeginWithUnderscore ? !/^_[^_]+$/.test(sub) : true)),
    )
  ) {
    return false;
  }

  // Check chars globally
  if (!/^[\w\-.*]+$/.test(punycodeVersion)) {
    return false;
  }

  return true;
}

export function isValidSubDomain(subDomain?: string, opts?: DomainOptions) {
  return !!subDomain && isValidDomain(`${subDomain}.example.com`, opts);
}

export function isValidReverseDomain(domain?: string, opts?: DomainOptions) {
  return (
    !!domain?.endsWith('.') &&
    isValidDomain(domain.slice(0, domain.length - 2), opts)
  );
}
