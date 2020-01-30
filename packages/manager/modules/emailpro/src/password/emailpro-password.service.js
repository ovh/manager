import fill from 'lodash/fill';
import forEach from 'lodash/forEach';
import isNaN from 'lodash/isNaN';
import remove from 'lodash/remove';

import { FEATURES } from './email-password.constants';

/* eslint-disable class-methods-use-this */
export default class EmailPasswordService {
  /*
   * This function is taken from:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FString%2FcharAt
   *
   * This is necessary because charAt(n) does not return unicode character and
   * will happily return half a surrogate pair for code points over 65535
   *
   * If you do a getWholeChar(n) on a the start of a pair, it will return the whole character.
   * If you do do it on the end of a pair, it will return false.
   *
   * If you want all the characters in a string, loop on its length and skip the falses.
   */
  getWholeChar(str, i) {
    const code = str.charCodeAt(i);

    if (isNaN(code)) {
      return ''; // Position not found
    }
    if (code < 0xd800 || code > 0xdfff) {
      return str.charAt(i);
    }
    // High surrogate (could change last hex to 0xDB7F to treat
    // high private surrogates as single characters)
    if (code >= 0xd800 && code <= 0xdbff) {
      if (str.length <= i + 1) {
        throw new Error('High surrogate without following low surrogate');
      }
      const next = str.charCodeAt(i + 1);
      if (next < 0xdc00 || next > 0xdfff) {
        throw new Error('High surrogate without following low surrogate');
      }
      return str.charAt(i) + str.charAt(i + 1);
    }

    // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
    if (i === 0) {
      throw new Error('Low surrogate without preceding high surrogate');
    }
    const prev = str.charCodeAt(i - 1);
    // (could change last hex to 0xDB7F to treat high private surrogates as single characters)
    if (prev < 0xd800 || prev > 0xdbff) {
      throw new Error('Low surrogate without preceding high surrogate');
    }
    // We can pass over low surrogates now as the second component
    // in a pair which we have already processed
    return false;
  }

  /*
    Adapted from here:

    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt#Example_4.3A_ES_6_codePointAt_shim

    The original monkeypatches strings to add the method there to match EcmaScript 6.
    */
  codePointAt(str, posParam) {
    const pos = isNaN(posParam) ? 0 : posParam;
    const code = str.charCodeAt(pos);
    const next = str.charCodeAt(pos + 1);

    // If a surrogate pair
    if (code >= 0xd800 && code <= 0xdbff && next >= 0xdc00 && next <= 0xdfff) {
      return (code - 0xd800) * 0x400 + (next - 0xdc00) + 0x10000;
    }
    return code;
  }

  passwordSimpleCheck(password, blankOk, minPasswordLength) {
    if (password === undefined || password === null) {
      return false;
    }

    if (blankOk && password === '') {
      return true;
    }

    // Length must be between minPasswordLength and 127 as per the EmailPro spec
    if (password.length < minPasswordLength || password.length > 127) {
      return false;
    }
    return true;
  }

  /**
   * Check for at least three of the following for conditions:
   * - lower cases
   * - upper cases
   * - special characters
   * - numbers
   */
  passwordComplexityCheck(password) {
    let numFeatures;
    let f;
    let r;
    let character;
    let point;

    numFeatures = 0;
    const alreadyUsed = fill(new Array(FEATURES.length), false);

    /* eslint-disable no-restricted-syntax, camelcase, no-labels, no-continue */
    characters_loop: for (let c = 0; c < password.length; c += 1) {
      character = this.getWholeChar(password, c);

      // If we are in between characters, char will be false
      if (!character) {
        continue;
      }

      point = this.codePointAt(character, 0);

      for (f = 0; f < FEATURES.length; f += 1) {
        if (alreadyUsed[f]) {
          // No need to check if a character is uppercase
          // or whatever if we already have one in that category
          continue;
        }
        for (r = 0; r < FEATURES[f].length; r += 1) {
          // Did we already pass the code point?

          // The arrays are sorted so if we passed, it's not in there
          // Most of the time, it will be in the very first range checked
          // Unless you go with fancy foreign characters
          if (FEATURES[f][r][0] > point) {
            break;
          }

          if (FEATURES[f][r][1] >= point) {
            numFeatures += 1;
            if (numFeatures === 3) {
              // If we already have three different password FEATURES, no need to
              // check if we might have 4 or 5, the password is strong enough
              // to please EmailPro
              return true;
            }
            alreadyUsed[f] = true;

            // Since we have a match, we're completely done with this character, let's
            // check the next one
            continue characters_loop;
          }
        }
      }
    }
    /* eslint-enable no-restricted-syntax, camelcase, no-labels, no-continue */
    return false;
  }

  /**
   * The displayName is parsed for delimiters: commas, periods, dashes or hyphens, underscores,
   * spaces, pound signs, and tabs.
   * If any of these delimiters are found, the displayName is split and all parsed
   * sections (tokens) are confirmed not to be
   * included in the password. Tokens that are less than three characters in length are ignored,
   * and substrings of the tokens
   * are not checked. For example, the name "Erin M, Hagens" is split into three tokens:
   * "Erin," "M," and "Hagens."
   * Because the second token is only one character long, it is ignored.
   * Therefore, this user could not have a password that
   * included either "erin" or "hagens" as a substring anywhere in the password.
   *
   * @param password
   * @param displayName
   */
  passwordContainsName(passwordParam, displayNameParam) {
    let password = passwordParam;
    let displayName = displayNameParam;
    let containsName;

    /* Microsoft documentation update: "Both checks are not case sensitive." */
    if (typeof password === 'string') {
      password = password.toLowerCase();
    }
    if (typeof displayName === 'string') {
      displayName = displayName.toLowerCase();
    }

    containsName = false;
    const splittedDisplayName = displayName.split(/[,.\-_£\s\t]/);

    remove(splittedDisplayName, (word) => word.length < 3);
    forEach(splittedDisplayName, (num) => {
      if (password.search(num) !== -1) {
        containsName = true;
      }
    });
    return containsName;
  }
}
/* eslint-enable class-methods-use-this */
