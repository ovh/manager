import angular from 'angular';
import isString from 'lodash/isString';
import punycode from 'punycode';
import ipaddr from 'ipaddr.js';
import URI from 'URIjs';

export default function() {
  const self = this;
  this.MAX_DOMAIN_LENGTH = 63;

  this.isValidIpv4 = function isValidIpv4(ip) {
    if (ip != null && isString(ip) && ip.split('.').length === 4) {
      return ipaddr.IPv4.isValid(ip);
    }

    return false;
  };

  // @todo use a regexp instead
  this.isValidIpv4Block = function isValidIpv4Block(block) {
    const split = block.split('/');
    return (
      split.length === 2 &&
      this.isValidIpv4(split[0]) &&
      parseInt(split[1], 10) > 0 &&
      parseInt(split[1], 10) < 33
    );
  };

  this.isValidIpv6 = function isValidIpv6(ip) {
    return ip != null && ipaddr.IPv6.isValid(ip);
  };

  // TODO use a regexp instead
  this.isValidIpv6Block = function isValidIpv6Block(block) {
    const split = block.split('/');
    return (
      split.length === 2 &&
      this.isValidIpv6(split[0]) &&
      parseInt(split[1], 10) > 0 &&
      parseInt(split[1], 10) < 129
    );
  };

  // opts.canBeginWithUnderscore = specifics NDD can be like: _foo._bar.example.com
  // opts.canContainsUnderscore = for CNAME validation: foo_bar._baz
  // opts.canBeginWithWildcard = specifics NDD can be like: *.foo.bar.example.com
  this.isValidDomain = function isValidDomain(domain, opts = {}) {
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
        (opts.canBeginWithWildcard
          ? !/^(?:\*\.)[^*]+$/.test(punycodeVersion)
          : true)
      ) {
        inError = true;
      }

      // Check subdomain(s)
      if (!inError) {
        angular.forEach(dotSplit, (sub) => {
          if (sub.length > 63 || /(?:(?:^\s*$)|(?:^-)|(?:-$))/.test(sub)) {
            inError = true;
          }
          if (
            sub.indexOf('_') !== -1 &&
            !opts.canContainsUnderscore &&
            (opts.canBeginWithUnderscore ? !/^_[^_]+$/.test(sub) : true)
          ) {
            inError = true;
          }
        });
      }

      // Check if it's not an IP
      if (!inError && (self.isValidIpv4(domain) || self.isValidIpv6(domain))) {
        inError = true;
      }

      // Check chars globally
      if (!inError) {
        inError = !/^[\w.*-]+$/.test(punycodeVersion);
      }
    }
    return !inError;
  };

  this.isValidSubDomain = function isValidSubDomain(subDomain, opts) {
    return self.isValidDomain(`${subDomain}.example.com`, opts);
  };

  this.isValidLetsEncryptDomain = (subdomain, domain, opts) =>
    self.isValidDomain(subdomain + domain, opts) ||
    (subdomain + domain).length < this.MAX_DOMAIN_LENGTH;

  /**
   * regexp matching
   * x.ca
   * x.ca:1
   * http://x.ca:1
   * http://x.ca
   * https://x.ca:1
   * https://x.ca
   * example.com
   * example.co.uk
   * www.example.com
   * example.com/path?query
   */
  this.isValidURL = (target) => {
    let hasValidProtocol = true;
    let hasValidPort = true;
    let uri = new URI(target);
    uri = uri.normalize();

    const hasPortWithoutProtocol =
      uri.protocol() &&
      target.match(/:/g) &&
      target.match(/:/g).length === 1 &&
      !target.match(/:\//g);

    // fix when uri has no protocol. Without this condition, we have some mixed parts in url.parts
    if (!uri.protocol() || hasPortWithoutProtocol) {
      uri = new URI(`http://${uri.toString()}`);
    }

    if (uri.protocol()) {
      hasValidProtocol = /^http(s?)$/.test(uri.protocol());
    }
    if (uri.port() && uri.host()) {
      hasValidPort = /(:[0-9]+)$/.test(uri.host()) && uri.port() <= 65535;
    }
    const hasValidDomain = /.+(\..+)*\.\w{2,}(\/.+)*/.test(uri.hostname());

    return (
      !!target &&
      !/:$/.test(target) &&
      (hasValidDomain || self.ipaddrValid(uri.hostname())) &&
      (!uri.protocol() || (uri.protocol() && hasValidProtocol)) &&
      (!uri.port() || (uri.port() && hasValidPort))
    );
  };

  // valid an ipv4 or ipv6
  this.ipaddrValid = (ip) => {
    if (self.isValidIpv4(ip)) {
      return true;
    }
    if (self.isValidIpv6(ip)) {
      return true;
    }

    return false;
  };
}
