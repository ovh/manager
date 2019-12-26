export const DEDICATED = 'DEDICATED';
export const CLOUD = 'CLOUD';
export const WEB = 'WEB';

export const MANAGER_URLS = {
  EU: {
    DEDICATED: {
      FR: 'https://www.ovh.com/manager/dedicated/',
    },
    CLOUD: {
      FR: 'https://www.ovh.com/manager/cloud/repsac/',
    },
    WEB: {
      FR: 'https://www.ovh.com/manager/web/',
    },
  },
  CA: {
    DEDICATED: {
      FR: 'https://ca.ovh.com/manager/',
    },
    CLOUD: {
      FR: 'https://ca.ovh.com/manager/cloud/repsac/',
    },
  },
  US: {
    DEDICATED: {
      FR: 'https://us.ovhcloud.com/manager/dedicated/',
    },
    CLOUD: {
      FR: 'https://us.ovhcloud.com/manager/cloud/repsac/',
    },
  },
};

export default {
  DEDICATED,
  CLOUD,
  WEB,
  MANAGER_URLS,
};
