export const IPV4_REGEX = {
  IP_V4_FORMAT: /^([0-9]{1,3}\.){3}[0-9]{1,3}$/,
  IP_CIDR_V4_FORMAT: /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
  PRIVATE: {
    LOCALHOST: /^localhost$/,
    LOCALHOST_NODE: /^127.0.0.1$/,
    RANGE_V4_10: /^(::ffff:)?10(\.\d{1,3}){3}$/,
    RANGE_V4_172: /^(::ffff:)?172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){2}$/,
    RANGE_V4_192: /^(::ffff:)?192\.168(\.\d{1,3}){2}$/,
  },
};

export default {
  IPV4_REGEX,
};
