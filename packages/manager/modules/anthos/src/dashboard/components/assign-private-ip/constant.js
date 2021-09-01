export const IPV4_BLOCK_REGEX = {
  RANGE: new RegExp(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)((\\/([0-9]|[1-2][0-9]|254))?)$',
  ),
};

export default {
  IPV4_BLOCK_REGEX,
};
