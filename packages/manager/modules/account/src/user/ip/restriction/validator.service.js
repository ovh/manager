export default function ValidatorService() {
  const self = this;

  this.isValidIpv4 = function isValidIpv4(ip) {
    let isValid;
    try {
      // Coz sometimes ipaddr is buggy
      isValid = ip && ip.split('.').length === 4 && ipaddr.IPv4.isValid(ip);
    } catch (e) {
      isValid = false;
      throw e;
    }
    return isValid;
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
    let isValid;
    try {
      // Coz sometimes ipaddr is buggy
      isValid = ip && ipaddr.IPv6.isValid(ip);
    } catch (e) {
      isValid = false;
      throw e;
    }
    return isValid;
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
  // opts.canBeginWithWildcard = specifics NDD can be like: *.foo.bar.example.com
  this.isValidDomain = function isValidDomain(domain, _opts) {
    let opts = _opts;
    if (!opts) {
      opts = {};
    }

    let inError = false;

    if (domain) {
      const punycodeVersion = punycode.toASCII(domain.trim());
      const dotSplit = punycodeVersion.split('.');

      // Check lengths
      inError = punycodeVersion.length > 255 || dotSplit.length < 2;

      // Check wildcard
      if (
        !inError &&
        ~punycodeVersion.indexOf('*') &&
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
            ~sub.indexOf('_') &&
            (opts.canBeginWithUnderscore ? !/^_[^_]+$/.test(sub) : true)
          ) {
            inError = true;
          }
        });
      }

      // Check chars globally
      if (!inError) {
        inError = !/^[\w\-.*]+$/.test(punycodeVersion);
      }
    }
    return !inError;
  };

  this.isValidSubDomain = function isValidSubDomain(subDomain, opts) {
    return self.isValidDomain(`${subDomain}.example.com`, opts);
  };
}
