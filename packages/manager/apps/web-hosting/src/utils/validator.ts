import ipaddr from 'ipaddr.js';
import punycode from 'punycode';

export const isValidIpv4 = function isValidIpv4(ip: string) {
  return ipaddr.IPv4.isValid(ip);
};

export const isValidIpv6 = function isValidIpv6(ip: string) {
  return ip != null && ipaddr.IPv6.isValid(ip);
};

// opts.canBeginWithUnderscore = specifics NDD can be like: _foo._bar.example.com
// opts.canContainsUnderscore = for CNAME validation: foo_bar._baz
// opts.canBeginWithWildcard = specifics NDD can be like: *.foo.bar.example.com
export const isValidDomain = function isValidDomain(
  domain: string,
  opts: {
    canBeginWithUnderscore?: boolean;
    canContainsUnderscore?: boolean;
    canBeginWithWildcard?: boolean;
  } = {},
) {
  let inError = false;

  if (domain) {
    const punycodeVersion = punycode.toASCII(domain.trim());
    const dotSplit = punycodeVersion.split('.');

    // Check lengths
    inError = punycodeVersion.length > 255 || dotSplit.length < 2;

    // Check wildcard
    if (
      !inError &&
      punycodeVersion.indexOf('*') !== -1 &&
      (opts?.canBeginWithWildcard ? !/^(?:\*\.)[^*]+$/.test(punycodeVersion) : true)
    ) {
      inError = true;
    }

    // Check subdomain(s)
    if (!inError) {
      inError = dotSplit.some((sub: string) => {
        if (sub.length > 63 || /(?:(?:^\s*$)|(?:^-)|(?:-$))/.test(sub)) {
          return true;
        }
        return (
          sub.indexOf('_') !== -1 &&
          !opts.canContainsUnderscore &&
          (opts.canBeginWithUnderscore ? !/^_[^_]+$/.test(sub) : true)
        );
      });
    }

    // Check if it's not an IP
    if (!inError && (isValidIpv4(domain) || isValidIpv6(domain))) {
      inError = true;
    }

    // Check chars globally
    if (!inError) {
      inError = !/^[\w.*-]+$/.test(punycodeVersion);
    }
  }
  return !inError;
};
