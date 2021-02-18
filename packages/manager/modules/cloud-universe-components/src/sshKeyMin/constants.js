export const SSHKEY_REGEX = [
  /* {
        name  : 'RSA1',
        regex : /^([0-9]+)\s+([0-9]+)\s+([0-9]+)\s+([^ @]+@[^@]+)$/
    }, */
  {
    name: 'RSA',
    regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+([^ @]+@[^@]+)$/,
  },
  {
    name: 'DSA',
    regex: /^(ssh-ds[sa])\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+([^ @]+@[^@]+)$/,
  },
  {
    name: 'ECDSA',
    regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+([^ @]+@[^@]+)$/,
  },
];

export default {
  SSHKEY_REGEX,
};
