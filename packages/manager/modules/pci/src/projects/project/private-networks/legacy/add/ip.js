import ipaddr from 'ipaddr.js';
import padStart from 'lodash/padStart';

export default class IP {
  static splitSubnetIpAddresses(networkAddress, cidr, numberOfChunk) {
    const networkMask = ipaddr.IPv4.subnetMaskFromPrefixLength(cidr).toString();

    const splitData = IP.getIpSplitData(
      networkAddress,
      networkMask,
      numberOfChunk,
    );
    const data = IP.validateSplitData(splitData);

    if (!data.isValid) {
      return {
        isValid: false,
        ipBlocks: [],
      };
    }

    const chunks = [];

    // When incrementing the initialIp we always skip 1 IP that will act as the network address
    // for the IPs block.
    const ipBlockIncrement = 2;
    let initialIp = splitData.hostAddressInteger + ipBlockIncrement;

    for (let i = 0; i < numberOfChunk; i += 1) {
      const start = initialIp;
      let end = start + splitData.chunkSize - 1;

      // If i is an uneven number, and if we have extras, we distribute one extra.
      if (splitData.extras && i % 2 !== 1) {
        end += 1;
        splitData.extras -= 1;
      }

      chunks.push({
        start: IP.convertIpIntToIpString(start),
        end: IP.convertIpIntToIpString(end),
        total: end - start + 1,
      });

      initialIp = end + ipBlockIncrement;
    }

    return {
      isValid: true,
      message: '',
      ipBlocks: chunks,
    };
  }

  static getIpSplitData(networkAddress, networkMask, numberOfChunk) {
    const hostAddressInteger = parseInt(
      IP.convertIpToByteString(networkAddress),
      2,
    );
    const networkMaskInteger = parseInt(
      IP.convertIpToByteString(networkMask),
      2,
    );
    const lastHostBit = IP.getNumberOfBitAllocatedToHost(
      networkAddress,
      networkMask,
    );

    // Number of total IPs for number of bit available - 1 IP for network address - 1 IP
    // for broadcast address - numberOfChunk.
    // eslint-disable-next-line no-restricted-properties
    const numberOfUsableIps = Math.pow(2, lastHostBit) - 2 - numberOfChunk;
    const chunkSize = Math.floor(numberOfUsableIps / numberOfChunk);
    const extras = numberOfUsableIps % numberOfChunk;

    return {
      networkMask,
      networkAddress,
      hostAddressInteger,
      networkMaskInteger,
      lastHostBit,
      numberOfChunk,
      chunkSize,
      numberOfUsableIps,
      extras,
    };
  }

  static validateSplitData(splitData) {
    let isValid = true;
    let message = '';

    if (splitData.numberOfChunk <= 0) {
      isValid = false;
      message = `Number of chunk needs to be at least 1.  Provided: ${splitData.numberOfChunk}.`;
    } else if (
      this.isAdressPartOfSubnet(splitData.networkAddress, splitData.networkMask)
    ) {
      isValid = false;
      message = `The provided network address (${splitData.networkAddress}) is not part of the subnet ${splitData.networkMask}.`;
    } else if (splitData.numberOfChunk > splitData.numberOfUsableIps) {
      isValid = false;
      message = `Too few possible addresses (${splitData.numberOfUsableIps}) for number of chunks (${splitData.numberOfChunk}).  At least 1 address is needed per chunk.`;
    }

    return {
      isValid,
      message,
    };
  }

  /* eslint-disable no-bitwise */
  static isAdressPartOfSubnet(networkAddress, networkMask) {
    const hostBitNumber = IP.getNumberOfBitAllocatedToHost('', networkMask);
    const hostAddressInteger = parseInt(
      IP.convertIpToByteString(networkAddress),
      2,
    );
    const networkMaskInteger = parseInt(
      IP.convertIpToByteString(networkMask),
      2,
    );

    const shiftedHostAdressInteger = hostAddressInteger >>> hostBitNumber;
    const shiftedNoetworkMaskInteger = networkMaskInteger >>> hostBitNumber;

    // Common way to see if an IP is part of a submask.
    // submask & (bitwise and) ipAddress should equal ipAddress if the IP is part of the submask.
    let bitWiseComparison =
      shiftedHostAdressInteger & shiftedNoetworkMaskInteger;
    // If the result is a negative integer, we shift it to unsigned int.
    bitWiseComparison =
      bitWiseComparison > 0 ? bitWiseComparison : bitWiseComparison >>> 0;

    return bitWiseComparison !== shiftedHostAdressInteger;
  }

  static convertIpIntToIpString(int) {
    const part1 = int & 255;
    const part2 = (int >> 8) & 255;
    const part3 = (int >> 16) & 255;
    const part4 = (int >> 24) & 255;

    return `${part4}.${part3}.${part2}.${part1}`;
  }
  /* eslint-enable no-bitwise */

  static getNumberOfBitAllocatedToHost(networkAddress, networkMask) {
    const lastHostMaskBit = IP.convertIpToByteString(networkMask, true).indexOf(
      1,
    );

    if (!networkAddress) {
      return lastHostMaskBit;
    }

    const lastHostAddressBit = IP.convertIpToByteString(
      networkAddress,
      true,
    ).indexOf(1);

    return Math.min(lastHostAddressBit, lastHostMaskBit);
  }

  static convertIpToByteString(ip, reverse) {
    const ipParts = ipaddr.parse(ip).octets;
    const bytes = ipParts.reduce(
      (byteString, octet) =>
        byteString.concat(padStart(octet.toString(2), 8, '0')),
      '',
    );

    if (reverse) {
      return bytes
        .split('')
        .reverse()
        .join('');
    }

    return bytes;
  }
}
