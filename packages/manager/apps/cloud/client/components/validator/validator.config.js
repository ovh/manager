/**
 * validator-js - @see https://github.com/chriso/validator.js
 *
 * Tips: You can test a model value, using ui-validate, like this:
 * ```
 * data-ui-validate="{"isIpValid": "MyCtrl.validator.isIP($value)" }"
 * ```
 * and then easily use ng-messages (```data-ng-message="isIpValid"```).
 */
angular.module('managerApp').run((validator) => {
  // -- Put your validator-js extends here

  // Validate an IPv4Block or IPv6Block
  validator.extend('isIPBlock', (str, version) => {
    if (version === 4 || version === 6) {
      const split = str.split('/');
      return (
        split.length === 2 &&
        validator.isIP(split[0], version) &&
        parseInt(split[1], 10) > 0 &&
        parseInt(split[1], 10) <= (version === 4 ? 32 : 128)
      );
    }
    return validator.isIPBlock(str, 4) || validator.isIPBlock(str, 6);
  });
});
