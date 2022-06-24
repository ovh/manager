import { Environment } from '@ovh-ux/manager-config';
import { Region } from '@ovh-ux/manager-config/types/environment/region.enum';

const helpRoot = 'https://help.ovhcloud.com';

interface ContentURLS {
  help: {
    [key in string]: string;
  };
  status: string;
}

type URLLinks = {
  [key in Region]: ContentURLS;
};

const urls: URLLinks = {
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

interface UseURL {
  get(id: keyof ContentURLS): string;
}

export function useURL(environment: Environment): UseURL {
  return {
    get: (id: keyof ContentURLS) => {
      const region = environment.getRegion();
      const user = environment.getUser();
      const regionURL = urls[region];
      const url = regionURL[id];
      return typeof url === 'string' ? url : url[user.ovhSubsidiary];
    },
  };
}

export default { useURL };
