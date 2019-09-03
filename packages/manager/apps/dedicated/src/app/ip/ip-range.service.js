angular.module('Module.ip.services').service('IpRange', function () {
  function convertIpToBin(_ip) {
    let ip = _ip;
    let i;
    let bin = '';
    let section_bin = '';

    while (ip.split('.').length < 4) {
      ip += '.0';
    }
    ip = ip.split('.');
    for (i = 0; i < ip.length; i++) {
      section_bin = parseInt(ip[i], 10).toString(2);
      while (section_bin.length < 8) {
        section_bin = `0${section_bin}`;
      }
      bin += section_bin;
    }
    return bin;
  }

  function convertBinToIp(bin) {
    let i;
    let ip = '';

    for (i = 0; i < 32; i += 8) {
      ip += `${parseInt(bin.substring(i, i + 8), 2)}.`;
    }
    ip = ip.substring(0, ip.length - 1);
    return ip;
  }

  function getStrCopy(str, _copies) {
    let newStr = str;
    let copies = _copies > 0 ? _copies : 1;
    while (--copies) {
      newStr += str;
    }
    return newStr;
  }

  function convertDecToBase(dec, base, _length, _padding) {
    const padding = _padding || '0';
    let num = dec.toString(base);
    const length = _length || num.length;
    if (num.length !== length) {
      if (num.length < length) {
        num = getStrCopy(padding, length - num.length) + num;
      } else {
        throw new Error(`convertDecToBase(): num(${num}).length > length(${length}) too long.`);
      }
    }
    return num;
  }

  function convertDecToIp(dec) {
    return convertBinToIp(convertDecToBase(dec, 2, 32));
  }

  function applySubnetBin(_ip_bin, subnet_bin, filler) {
    let ip_bin = _ip_bin;
    for (let i = 0; i < 32; i++) {
      if (subnet_bin.charAt(i) === '0') {
        ip_bin = ip_bin.substring(0, i);
        for (; i < 32; i++) {
          ip_bin += filler;
        }
        break;
      }
    }
    return ip_bin;
  }

  // Returns *ALL* IP of the range!
  this.getRangeForIpv4Block = function (ipBlock) {
    // @todo IPv6.
    if (!/\/(.+)$/.test(ipBlock) || !/\./.test(ipBlock)) {
      return [ipBlock];
    }

    // damn!
    let i;
    let subnet_bin = '';
    let ipfrom_bin;
    const range = [];

    const subnet_int = ipBlock.match(/\/(.+)$/)[1];
    for (i = 0; i < 32; i++) {
      subnet_bin += i < subnet_int ? '1' : '0';
    }

    // calculate start IP
    const ipfrom = ipBlock.substring(0, ipBlock.indexOf('/'));

    ipfrom_bin = convertIpToBin(ipfrom);
    ipfrom_bin = applySubnetBin(ipfrom_bin, subnet_bin, '0');

    const ipto_bin = applySubnetBin(ipfrom_bin, subnet_bin, '1');

    const ipfrom_bin_dec = parseInt(ipfrom_bin, 2);
    const ipto_bin_dec = parseInt(ipto_bin, 2);

    for (i = ipfrom_bin_dec; i <= ipto_bin_dec; i++) {
      range.push(convertDecToIp(i));
    }

    return range;
  };
});
