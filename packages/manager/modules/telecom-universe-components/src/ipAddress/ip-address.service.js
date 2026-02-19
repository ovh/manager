import { Address4, Address6 } from 'ip-address';

/**
 * Wrapper for ip-address library.
 * See doc here: http://ip-address.js.org/
 */
export default function() {
  /**
   * Returns a new instance of Address6.
   */
  this.address6 = function address6(...args) {
    return new Address6(...args);
  };

  /**
   * Returns a new instance of Address4.
   */
  this.address4 = function address4(...args) {
    return new Address4(...args);
  };

  /**
   * Shortcut method to test if a given ip string is a valid IPv4 or IPv6.
   */
  this.isValidIp = function isValidIp(ip) {
    return Address4.isValid(ip) || Address6.isValid(ip);
  };

  this.isValidPublicIp4 = function isValidPublicIp4(ip) {
    try {
      const addr = this.address4(ip);
      let valid = false;
      if (Address4.isValid(ip)) {
        const bytes = addr.toArray();
        valid = true;
        if (bytes[0] === 10) {
          valid = false;
        } else if (bytes[0] === 172 && bytes[1] >= 16 && bytes[1] <= 31) {
          valid = false;
        } else if (bytes[0] === 192 && bytes[1] === 168) {
          valid = false;
        }
      }
      return valid;
    } catch (e) {
      return false;
    }
  };
}
