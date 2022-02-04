const helpRoot = 'https://help.ovhcloud.com';

const urls = {
  EU: {
    help: {
      DE: `${helpRoot}/de`,
      ES: `${helpRoot}/es-es`,
      FR: `${helpRoot}/fr`,
      GB: `${helpRoot}/en-gb`,
      IE: `${helpRoot}/en-ie`,
      IT: `${helpRoot}/it`,
      MA: `${helpRoot}/fr-ma`,
      NL: `${helpRoot}/nl`,
      PL: `${helpRoot}/pl`,
      PT: `${helpRoot}/pt`,
      SN: `${helpRoot}/fr-sn`,
      TN: `${helpRoot}/fr-tn`,
    },
    status: 'https://www.status-ovhcloud.com/',
  },
  CA: {
    help: {
      ASIA: `${helpRoot}/asia`,
      AU: `${helpRoot}/en-au`,
      CA: `${helpRoot}/en-ca`,
      QC: `${helpRoot}/fr-ca`,
      SG: `${helpRoot}/en-sg`,
      WE: `${helpRoot}/en`,
      WS: `${helpRoot}/es`,
    },
    status: 'https://www.status-ovhcloud.com/',
  },
  US: {
    help: {
      US: 'https://us.ovhcloud.com/support',
    },
    status: 'https://status.us.ovhcloud.com/',
  },
};

export function useURL(environment) {
  return {
    get: (id) => {
      const region = environment.getRegion();
      const user = environment.getUser();
      const url = urls[region][id];
      return typeof url === 'string' ? url : url[user.ovhSubsidiary];
    },
  };
}

export default { useURL };
