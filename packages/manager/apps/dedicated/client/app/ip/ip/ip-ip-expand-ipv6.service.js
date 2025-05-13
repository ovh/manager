export default function IpExpandIpv6() {
  // [JS] Expand Abbreviated IPv6 Addresses
  // by Christopher Miller
  // http://forrst.com/posts/JS_Expand_Abbreviated_IPv6_Addresses-1OR
  // Modified to work with embedded IPv4 addresses
  /* jshint ignore:start */
  this.expandIPv6Address = function expandIPv6Address(_address) {
    let address = _address;
    let fullAddress = '';
    let expandedAddress = '';
    const validGroupCount = 8;
    const validGroupSize = 4;

    let ipv4 = '';
    const extractIpv4 = /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/;
    const validateIpv4 = /((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})/;

    // look for embedded ipv4
    if (validateIpv4.test(address)) {
      const groups = address.match(extractIpv4);
      for (let i = 1; i < groups.length; i += 1) {
        ipv4 +=
          `00${parseInt(groups[i], 10).toString(16)}`.slice(-2) +
          (i === 2 ? ':' : '');
      }
      address = address.replace(extractIpv4, ipv4);
    }

    if (address.indexOf('::') === -1) {
      // All eight groups are present.
      fullAddress = address;
    } else {
      // Consecutive groups of zeroes have been collapsed with "::".
      const sides = address.split('::');
      let groupsPresent = 0;
      for (let i = 0; i < sides.length; i += 1) {
        groupsPresent += sides[i].split(':').length;
      }
      fullAddress += `${sides[0]}:`;
      for (let i = 0; i < validGroupCount - groupsPresent; i += 1) {
        fullAddress += '0000:';
      }
      fullAddress += sides[1];
    }
    const groups = fullAddress.split(':');
    for (let i = 0; i < validGroupCount; i += 1) {
      while (groups[i].length < validGroupSize) {
        groups[i] = `0${groups[i]}`;
      }
      expandedAddress +=
        i !== validGroupCount - 1 ? `${groups[i]}:` : groups[i];
    }
    return expandedAddress;
  };
  /* jshint ignore:end */
}
