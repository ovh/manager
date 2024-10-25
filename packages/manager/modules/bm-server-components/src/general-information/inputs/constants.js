export const INPUTS_RULES = {
  date: {
    format: 'Y-m-d',
    placeholder: 'YYYY-MM-DD',
  },
  email: {
    maxsize: 256,
    pattern: /^[A-Za-z0-9._%+-]{1,64}@([a-z0-9-.]{1,250}\.[a-z]{2,63})$/,
  },
  hexstring: {
    maxsize: 256,
    pattern: /^[a-f0-9]{1,256}$/i,
  },
  hostname: {
    maxsize: 253,
    pattern: /^([a-z](?:[a-z0-9-]{0,61}[a-z0-9])?)+(\.[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  },
  ip: {
    maxsize: 15,
    pattern: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
    placeholder: 'AAA.BBB.CCC.DDD',
  },
  keyValue: {
    key: {
      maxsize: 256,
      pattern: /^[a-z0-9-]{1,256}$/i,
    },
    value: {
      maxsize: 2000,
      pattern: /^[a-z0-9-_.~ !#$&()*+,/:;=?@]{1,2000}$/i,
    },
    limit: 10,
  },
  sshPubKey: {
    maxsize: 15,
    pattern: /\b(ssh-rsa|ecdsa-sha\d+-nistp\d+|ssh-ed\d+)\s+(AAAA[a-zA-Z0-9/=+]+)(\s+(\S{1,128}))*$/,
    placeholder:
      'ssh-rsa AAAAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX== my-public-key',
  },
  string: {
    maxsize: 256,
  },
  text: {
    maxsize: 15,
  },
  time: {
    format: 'H:i:S',
    placeholder: 'HH:MM:SS',
  },
  url: {
    maxsize: 2000,
    pattern: /^((ftps?|https?|sftp|smbs?|tftp):\/\/)?((((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4})|((::)?[0-9a-fA-F]{1,4}(::?[0-9a-fA-F]{1,4}){1,7}(::)?)|((([\w]+:)?\w+@)?([a-z0-9-.]{1,250}\.[a-z]{2,63})))(:([1-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?(\/|\/.+)?$/,
  },
  uuid: {
    maxsize: 36,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  },
  default: {
    maxsize: 256,
  },
};

export default {
  INPUTS_RULES,
};
