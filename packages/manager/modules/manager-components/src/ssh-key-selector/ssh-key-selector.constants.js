export const SSH_KEY = {
  pattern: /\b(ssh-rsa|ecdsa-sha\d+-nistp\d+|ssh-ed\d+)\s+(AAAA[a-zA-Z0-9/=+]+)(\s+(\S{1,128}))*$/,
  placeholder:
    'ssh-rsa AAAAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX== my-public-key',
  rows: 15,
};
