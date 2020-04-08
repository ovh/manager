/* eslint-disable class-methods-use-this */
import forEach from 'lodash/forEach';
import padStart from 'lodash/padStart';
import times from 'lodash/times';

export default class {
  convertIpToBin(_ip) {
    let ip = _ip;
    let bin = '';
    let sectionBin = '';

    while (ip.split('.').length < 4) {
      ip += '.0';
    }
    ip = ip.split('.');

    forEach(ip, (ipValue) => {
      sectionBin = parseInt(ipValue, 10).toString(2);
      bin += padStart(sectionBin, 8, '0');
    });

    return bin;
  }

  convertBinToIp(bin) {
    let i;
    let ip = '';

    for (i = 0; i < 32; i += 8) {
      ip += `${parseInt(bin.substring(i, i + 8), 2)}.`;
    }
    ip = ip.substring(0, ip.length - 1);
    return ip;
  }

  getStrCopy(str, _copies) {
    const copies = _copies > 0 ? _copies : 1;

    return times(copies, () => str).join('');
  }

  convertDecToBase(dec, base, _length, padding = '0') {
    let num = dec.toString(base);
    const length = _length || num.length;
    if (num.length !== length) {
      if (num.length < length) {
        num = this.getStrCopy(padding, length - num.length) + num;
      } else {
        throw new Error(
          `convertDecToBase(): num(${num}).length > length(${length}) too long.`,
        );
      }
    }
    return num;
  }

  convertDecToIp(dec) {
    return this.convertBinToIp(this.convertDecToBase(dec, 2, 32));
  }

  applySubnetBin(_ipBin, subnetBin, filler) {
    let ipBin = _ipBin;
    for (let i = 0; i < 32; i += 1) {
      if (subnetBin.charAt(i) === '0') {
        ipBin = ipBin.substring(0, i);
        for (; i < 32; i += 1) {
          ipBin += filler;
        }
        break;
      }
    }
    return ipBin;
  }

  // Returns *ALL* IP of the range!
  getRangeForIpv4Block(ipBlock) {
    // @todo IPv6.
    if (!/\/(.+)$/.test(ipBlock) || !/\./.test(ipBlock)) {
      return [ipBlock];
    }

    let i;
    let subnetBin = '';
    let ipFromBin;
    const range = [];

    const subnetInt = ipBlock.match(/\/(.+)$/)[1];
    for (i = 0; i < 32; i += 1) {
      subnetBin += i < subnetInt ? '1' : '0';
    }

    // calculate start IP
    const ipfrom = ipBlock.substring(0, ipBlock.indexOf('/'));

    ipFromBin = this.convertIpToBin(ipfrom);
    ipFromBin = this.applySubnetBin(ipFromBin, subnetBin, '0');

    const ipToBin = this.applySubnetBin(ipFromBin, subnetBin, '1');

    const ipFromBinDec = parseInt(ipFromBin, 2);
    const ipToBinDec = parseInt(ipToBin, 2);

    for (i = ipFromBinDec; i <= ipToBinDec; i += 1) {
      range.push(this.convertDecToIp(i));
    }

    return range;
  }
}
