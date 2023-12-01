export const DOCUMENTATION_LINK =
  'https://cloudinit.readthedocs.io/en/latest/reference/datasources/configdrive.html';

export const SUPPORTED_SSH_KEY_FORMATS = [
  {
    name: 'RSA',
    regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})(\s+.*)?$/,
  },
  {
    name: 'ECDSA',
    regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})(\s+.*)?$/,
  },
  {
    name: 'ED25519',
    regex: /^(ssh-ed25519)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})(\s+.*)?$/,
  },
];

export default {
  DOCUMENTATION_LINK,
  SUPPORTED_SSH_KEY_FORMATS,
};
