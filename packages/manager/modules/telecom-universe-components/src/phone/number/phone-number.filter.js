import isString from 'lodash/isString';
import trim from 'lodash/trim';

export default () => {
  /**
   * Please see:
   * https://en.wikipedia.org/wiki/List_of_country_calling_codes
   */
  const euCodes = [
    30,
    31,
    32,
    33,
    34,
    350,
    351,
    352,
    353,
    354,
    355,
    356,
    357,
    358,
    359,
    36,
    370,
    371,
    372,
    373,
    374,
    375,
    376,
    377,
    378,
    379,
    380,
    381,
    382,
    383,
    385,
    386,
    387,
    389,
    39,
    40,
    41,
    420,
    421,
    423, // this is the mighty country of Liechtenstein
    43,
    44,
    45,
    46,
    47,
    48,
    49,
  ];

  const numberPrefixSplitRegex = new RegExp(`^00(${euCodes.join('|')})(.*)$`);
  const numberOnlyRegex = /^[0-9]+$/;

  function prettifyNumber(rawNumber) {
    if (!isString(rawNumber)) {
      return rawNumber;
    }

    /**
     * It turns out that pretty formatting a phone number is complicated.
     * Some countries group numbers by 3 other groups numbers by 2 ...
     * There are a lots of rules that must be handled separately for each different country.
     *
     * To simplify we will just add space every two numbers, for example a french number
     * will look like so: +33 6 12 23 45 78 (which is correct).
     *
     * It should be ok for most EU numbers and make other numbers human readable.
     * If you feel like implementing a more complex formatting ... good luck :-)
     */
    return rawNumber.replace(numberPrefixSplitRegex, (number, prefix, rest) => {
      let suffix = rest;

      // only try to format if rest is only unformatted numbers
      if (numberOnlyRegex.test(suffix)) {
        // if length is odd, add space after first character
        if (suffix.length % 2 === 1) {
          suffix = `${suffix.charAt(0)} ${suffix.substr(1)}`;
        }

        // add space every two characters
        suffix = suffix.replace(/([0-9]{2})/g, '$1 ');
      }
      return trim(`+${prefix} ${suffix}`);
    });
  }

  return function phoneNumberFilter(tel) {
    return prettifyNumber(tel);
  };
};
