export const UNITS_CONVERTER = {
  bytes_to_megabytes: 1 / 1048576,
};

export const METRICS_CONVERTER = {
  net_send: UNITS_CONVERTER.bytes_to_megabytes,
  net_receive: UNITS_CONVERTER.bytes_to_megabytes,
};

export default {
  UNITS_CONVERTER,
  METRICS_CONVERTER,
};
