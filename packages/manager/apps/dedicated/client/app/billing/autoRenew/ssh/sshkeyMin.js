const SSHKEY_REGEX = [
  {
    name: 'RSA',
    regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
  },
  {
    name: 'ECDSA',
    regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
  },
  {
    name: 'ED25519',
    regex: /^(ssh-ed25519)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
  },
];

export default /* @ngInject */ function sshkeyMinFilter() {
  let splitted;
  let minLength;
  let innerkeyLength;
  let subLength;
  const toLength = 50;
  const dots = '...';
  let type = false;
  let i;

  return function sshkeyMin(keyParam) {
    let key = keyParam;

    key = key.trim().replace(/\n/, '');
    type = false;

    /* eslint-disable */
    for (i = SSHKEY_REGEX.length; i--; ) {
      if (SSHKEY_REGEX[i].regex.test(key)) {
        type = SSHKEY_REGEX[i];
        splitted = key.match(SSHKEY_REGEX[i].regex);
        break;
      }
    }
    /* eslint-enable */

    if (type && type.name === 'RSA1' && splitted.length === 5) {
      // special rule...

      // '3' = 3 spaces
      minLength =
        splitted[1].length + splitted[2].length + splitted[4].length + 3;

      if (minLength < toLength - dots.length - 2) {
        //  ('2' = min 2 chars each side of dots)
        innerkeyLength = splitted[3].length;
        subLength = (toLength - minLength - dots.length) / 2;
        return `${splitted[1]} ${splitted[2]} ${splitted[3].substr(
          0,
          subLength,
        )}${dots}${splitted[3].substr(
          innerkeyLength - subLength,
          innerkeyLength,
        )} ${splitted[4]}`;
      }
    } else if (type && splitted.length === 4) {
      minLength = splitted[1].length + splitted[3].length + 2; // '2' = 2 spaces

      if (minLength < toLength - dots.length - 2) {
        //  ('2' = min 2 chars each side of dots)
        innerkeyLength = splitted[2].length;
        subLength = (toLength - minLength - dots.length) / 2;
        return `${splitted[1]} ${splitted[2].substr(
          0,
          subLength,
        )}${dots}${splitted[2].substr(
          innerkeyLength - subLength,
          innerkeyLength,
        )} ${splitted[3]}`;
      }
    }

    // else...Split /2
    /* eslint-disable no-mixed-operators */
    return (
      key.substr(0, toLength / 2 - dots.length) +
      dots +
      key.substr(key.length - toLength / 2 + dots.length, key.length)
    );
  };
}
