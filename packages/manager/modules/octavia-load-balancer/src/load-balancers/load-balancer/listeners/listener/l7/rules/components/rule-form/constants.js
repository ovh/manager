export const RULE_TYPES = {
  COOKIE: 'cookie',
  FILE_TYPE: 'fileType',
  HEADER: 'header',
  HOST_NAME: 'hostName',
  PATH: 'path',
  SSL_CONN_HAS_CERT: 'sslConnHasCert',
  SSL_VERIFY_RESULT: 'sslVerifyResult',
  SSL_DN_FIELD: 'sslDNField',
};

export const RULE_TYPES_LABELS = {
  [RULE_TYPES.COOKIE]: 'Cookie',
  [RULE_TYPES.FILE_TYPE]: 'File type',
  [RULE_TYPES.HEADER]: 'Header',
  [RULE_TYPES.HOST_NAME]: 'Host name',
  [RULE_TYPES.PATH]: 'Path',
  [RULE_TYPES.SSL_CONN_HAS_CERT]: 'SSL conn has cert',
  [RULE_TYPES.SSL_VERIFY_RESULT]: 'SSL verify result',
  [RULE_TYPES.SSL_DN_FIELD]: 'SSL DN field',
};

export const RULE_TYPES_LIST = [
  {
    value: RULE_TYPES.COOKIE,
    label: RULE_TYPES_LABELS[RULE_TYPES.COOKIE],
  },
  {
    value: RULE_TYPES.FILE_TYPE,
    label: RULE_TYPES_LABELS[RULE_TYPES.FILE_TYPE],
  },
  {
    value: RULE_TYPES.HEADER,
    label: RULE_TYPES_LABELS[RULE_TYPES.HEADER],
  },
  {
    value: RULE_TYPES.HOST_NAME,
    label: RULE_TYPES_LABELS[RULE_TYPES.HOST_NAME],
  },
  {
    value: RULE_TYPES.PATH,
    label: RULE_TYPES_LABELS[RULE_TYPES.PATH],
  },
  {
    value: RULE_TYPES.SSL_CONN_HAS_CERT,
    label: RULE_TYPES_LABELS[RULE_TYPES.SSL_CONN_HAS_CERT],
  },
  {
    value: RULE_TYPES.SSL_VERIFY_RESULT,
    label: RULE_TYPES_LABELS[RULE_TYPES.SSL_VERIFY_RESULT],
  },
  {
    value: RULE_TYPES.SSL_DN_FIELD,
    label: RULE_TYPES_LABELS[RULE_TYPES.SSL_DN_FIELD],
  },
];

export const RULE_COMPARE_TYPES = {
  REGEX: 'regex',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  CONTAINS: 'contains',
  EQUAL_TO: 'equalTo',
};

export const RULE_COMPARE_TYPES_LABELS = {
  [RULE_COMPARE_TYPES.REGEX]: 'Regex',
  [RULE_COMPARE_TYPES.STARTS_WITH]: 'Starts with',
  [RULE_COMPARE_TYPES.ENDS_WITH]: 'Ends with',
  [RULE_COMPARE_TYPES.CONTAINS]: 'Contains',
  [RULE_COMPARE_TYPES.EQUAL_TO]: 'Equal to',
};

export const RULE_COMPARE_TYPES_LIST = [
  {
    value: RULE_COMPARE_TYPES.REGEX,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.REGEX],
  },
  {
    value: RULE_COMPARE_TYPES.STARTS_WITH,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.STARTS_WITH],
  },
  {
    value: RULE_COMPARE_TYPES.ENDS_WITH,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.ENDS_WITH],
  },
  {
    value: RULE_COMPARE_TYPES.CONTAINS,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.CONTAINS],
  },
  {
    value: RULE_COMPARE_TYPES.EQUAL_TO,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.EQUAL_TO],
  },
];

export const RULE_TYPES_WITH_KEY = [
  RULE_TYPES.COOKIE,
  RULE_TYPES.HEADER,
  RULE_TYPES.SSL_DN_FIELD,
];

export const COMPARE_TYPES_AVAILABILITY_BY_TYPE = {
  [RULE_TYPES.COOKIE]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.FILE_TYPE]: RULE_COMPARE_TYPES_LIST.filter(
    (type) =>
      type.value === RULE_COMPARE_TYPES.EQUAL_TO ||
      type.value === RULE_COMPARE_TYPES.REGEX,
  ),
  [RULE_TYPES.HEADER]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.HOST_NAME]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.PATH]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.SSL_CONN_HAS_CERT]: RULE_COMPARE_TYPES_LIST.filter(
    (type) => type.value === RULE_COMPARE_TYPES.EQUAL_TO,
  ),
  [RULE_TYPES.SSL_VERIFY_RESULT]: RULE_COMPARE_TYPES_LIST.filter(
    (type) => type.value === RULE_COMPARE_TYPES.EQUAL_TO,
  ),
  [RULE_TYPES.SSL_DN_FIELD]: RULE_COMPARE_TYPES_LIST,
};

export const VALUE_REGEX_BY_TYPE = {
  [RULE_TYPES.COOKIE]: "^[a-zA-Z0-9!#$%&'()*+-./:<=>?@[\\]^_`{|}~]+$",
  [RULE_TYPES.FILE_TYPE]:
    '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.HEADER]: '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.HOST_NAME]:
    '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.PATH]: '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.SSL_CONN_HAS_CERT]: '^True$',
  [RULE_TYPES.SSL_VERIFY_RESULT]: '^[0-9]+$',
  [RULE_TYPES.SSL_DN_FIELD]: '',
};

export const KEY_REGEX = "^[a-zA-Z0-9!#$%&'*+-.^_`|~]+$";

export default {
  RULE_TYPES,
  RULE_TYPES_LABELS,
  RULE_TYPES_LIST,
  RULE_COMPARE_TYPES,
  RULE_COMPARE_TYPES_LABELS,
  RULE_COMPARE_TYPES_LIST,
  RULE_TYPES_WITH_KEY,
  COMPARE_TYPES_AVAILABILITY_BY_TYPE,
  VALUE_REGEX_BY_TYPE,
  KEY_REGEX,
};
