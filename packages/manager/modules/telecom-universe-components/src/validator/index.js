import angular from 'angular';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import reduce from 'lodash/reduce';
import punycode from 'punycode';
import validator from 'validator';

const moduleName = 'tucValidator';

angular
  .module(moduleName, [])
  .constant('tucValidator', validator)
  .run((tucValidator) => {
    const Rio = function Rio(rioStr) {
      if (!/[A-Z0-9+]{12}/i.test(rioStr)) {
        return;
      }
      const rioUp = rioStr.toUpperCase();
      this.isMobile = /^d{2}$/.test(rioUp.substr(0, 2)); // mobile RIO : only figures
      this.isFix = /^[F-Z][0-9A-Z]/.test(rioUp.substr(0, 2)); // fix RIO
      this.provider = rioUp.substr(0, 2);
      this.contractType = rioUp.substr(2, 1);
      this.customer = rioUp.substr(3, 6);
      this.control = rioUp.substr(9, 3);
      this.rio = rioUp;
    };
    const customValidator = tucValidator;

    function checkRioSum(str, control) {
      const order = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+';
      let a = 0;
      let b = 0;
      let c = 0;
      for (let i = 0; i < 19; i += 1) {
        const position = order.indexOf(str[i]);
        a = (1 * a + position) % 37;
        b = (2 * b + position) % 37;
        c = (4 * c + position) % 37;
      }
      return order[a] + order[b] + order[c] === control;
    }

    Rio.prototype.check = function check(phoneNumber) {
      const tel = (phoneNumber || '').replace(/[^0-9]/g, '');
      const rioValid = checkRioSum(
        this.provider + this.contractType + this.customer + tel,
        this.control,
      );
      const rioCompliant =
        (/^0[6-7]/.test(tel) && this.isMobile) ||
        (/^0[1-5]/.test(tel) && this.isFix);
      return !!this.rio && rioValid && rioCompliant;
    };

    /**
     * Validate a RIO
     * @param {String} rio          RIO code
     * @param {String} phoneNumber  Corresponding phone number
     */
    customValidator.tucIsRio = (rio, phoneNumber) =>
      new Rio(rio).check(phoneNumber);

    /**
     * Validate a Standard insee
     * @param {Object} obj          Object containing in
     */
    customValidator.tucHasInseeCode = (obj) => isObject(obj) && !!obj.inseeCode;

    /**
     * Validate a zipcode
     * @param {String} zipcode Zip code to validate
     * @param  {Array} filter  scope of the zip code
     */
    customValidator.tucIsZipcode = (zipcode, filter) => {
      const check = {
        frenchOverseas: /^9[78]\d{3}$/.test(zipcode),
        metropolitanFrance:
          /^\d{5}$/.test(zipcode) && zipcode >= 1000 && zipcode < 96000,
        fr:
          (/^\d{5}$/.test(zipcode) && zipcode >= 1000 && zipcode < 96000) ||
          /^9[78]\d{3}$/.test(zipcode),
        be: /^\d{4}$/.test(zipcode) && zipcode >= 1000,
        de: /^\d{5}$/.test(zipcode) && zipcode >= 10000,
        ch: /^\d{4}$/.test(zipcode) && zipcode >= 1000 && zipcode < 9499,
        es:
          /^\d{5}$/.test(zipcode) &&
          ((zipcode >= 1000 && zipcode < 53000) ||
            /^070/.test(zipcode) ||
            /^071/.test(zipcode) ||
            /^080/.test(zipcode)),

        // No real validation rules ! there are cases for London (new rule),
        // London (old rule), Eire, the rest of the country
        gb: true,
      };
      const theFilter = filter || Object.keys(check);
      return theFilter.reduce((all, thisTest) => all || check[thisTest], false);
    };

    const { isIP } = validator;
    customValidator.isIP = (str, version) => isIP(str || '', version);

    /**
     *  Validate an IPv4Block or IPv6Block
     *  @param {String} str     IP representation string
     *  @param {Number} version IP version
     */
    customValidator.tucIsIPBlock = (str, version) => {
      if (version === 4 || version === 6) {
        const split = str.split('/');
        return (
          split.length === 2 &&
          customValidator.isIP(split[0], version) &&
          parseInt(split[1], 10) > 0 &&
          parseInt(split[1], 10) <= (version === 4 ? 32 : 128)
        );
      }
      return (
        customValidator.tucIsIPBlock(str, 4) ||
        customValidator.tucIsIPBlock(str, 6)
      );
    };

    /**
     *  Validate a private IP range (according to RFC 1918)
     *  @param {String} str     IP representation string
     *  @return {Boolean}
     */
    customValidator.tucIsPrivateIPv4 = (str) => {
      if (customValidator.isIP(str, 4)) {
        const ipBlock = str.split('.');
        const bitBlock = parseInt(ipBlock[0], 10);
        const secondBitBlock = parseInt(ipBlock[1], 10);
        switch (bitBlock) {
          case 192: // 16-bit block
            return secondBitBlock === 168;
          case 172: // 20-bit block
            return secondBitBlock >= 16 && secondBitBlock <= 31;
          default:
            // 24-bit block
            return parseInt(bitBlock, 10) === 10;
        }
      }

      return false;
    };

    /**
     *  Validate a siret code
     *  @param {String} siret SIRET code
     */
    customValidator.tucIsSiret = (siret) => {
      if (isEmpty(siret)) {
        return true;
      }
      const theSiret = `${/^\d{14}$/.test(siret) ? siret : '00000000000001'}`;
      const luhn = theSiret
        .split('')
        .reverse()
        .map((val, index) => (index % 2 ? val * 2 : parseInt(val, 10)));
      const luhnSum = luhn.reduce(
        (total, elt) => total + (elt < 10 ? elt : elt - 9),
        0,
      );
      return luhnSum % 10 === 0;
    };

    customValidator.tucIsFrenchLandLine = (phone) =>
      /^0[1-5]([\\s\\-]?([0-9]){2}){4}$/.test(phone);

    customValidator.tucIsFrenchPhoneNumber = (phone) =>
      /^(0033|\+33\s?(\(0\))?|0)[^08](\s*\d{2}){4}$/.test(phone);

    customValidator.tucIsMacAddress = (val) => {
      const values = val.split(/:/);
      return (
        values.length === 6 &&
        reduce(
          values,
          (result, elt) => /^[0-9a-f]{2}$/i.test(elt) && result,
          true,
        )
      );
    };

    /**
     * Check if a domain is valid
     * @param {String}  domain                          - The domain to check validity
     * @param {Object}  options                         - Options for validation check
     * @param {Boolean} options.canBeginWithUnderscore  - specifics NDD can be like:
                                                          _foo._bar.example.com
     * @param {Boolean} options.canBeginWithWildcard    - specifics NDD can be like:
                                                          *.foo.bar.example.com
     * @return {Boolean}
     */
    customValidator.tucIsValidDomain = (domain, options) => {
      const theOptions = options || {};
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
          (theOptions.canBeginWithWildcard
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
              (theOptions.canBeginWithUnderscore ? !/^_[^_]+$/.test(sub) : true)
            ) {
              inError = true;
            }
          });
        }

        // Check if it's not an IP
        if (!inError && customValidator.isIP(domain)) {
          inError = true;
        }

        // Check chars globally
        if (!inError) {
          inError = !/^[\w\-.*]+$/.test(punycodeVersion);
        }
      }
      return !inError;
    };
  });

export default moduleName;
