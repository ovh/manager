export const DATAGRID_CONFIG = {
  PUBLIC: {
    PAGE_SIZE: 10,
  },
  PRIVATE: {
    PAGE_SIZE: 10,
  },
};

export const IPV4_BLOCK_REGEX = {
  RANGE: new RegExp(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)((\\/([0-9]|[1-2][0-9]|254))?)$',
  ),
};

export default {
  DATAGRID_CONFIG,
  IPV4_BLOCK_REGEX,
};
