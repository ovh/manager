import { Environment, Region } from '@ovh-ux/manager-config';

const helpRoot = 'https://help.ovhcloud.com/csm';
const homeIndex = '-home?id=csm_index';
const support = `${helpRoot}?id=csm_cases_requests&ovhSubsidiary=`;

const cloud_changelog = 'https://github.com/orgs/ovh/projects/16/views/6';
const hosting_and_collab_changelog = 'https://github.com/orgs/ovh/projects/18/views/2';

export interface ContentURLS {
  help: {
    [key in string]: string;
  };
  support?: string;
  status: string;
  marketplace?: string;
  cloud_changelog?:string;
  hosting_and_collab_changelog?:string;
}

type URLLinks = {
  [key in Region]: ContentURLS;
};

const urls: URLLinks = {
  EU: {
    help: {
      DE: `${helpRoot}/de${homeIndex}`,
      ES: `${helpRoot}/es${homeIndex}`,
      FR: `${helpRoot}/fr${homeIndex}`,
      GB: `${helpRoot}/en-gb${homeIndex}`,
      IE: `${helpRoot}/en-ie${homeIndex}`,
      IT: `${helpRoot}/it${homeIndex}`,
      MA: `${helpRoot}/fr-ma${homeIndex}`,
      NL: `${helpRoot}/en-ie${homeIndex}`,
      PL: `${helpRoot}/pl${homeIndex}`,
      PT: `${helpRoot}/pt${homeIndex}`,
      SN: `${helpRoot}/fr-sn${homeIndex}`,
      TN: `${helpRoot}/fr-tn${homeIndex}`,
    },
    support,
    status: 'https://www.status-ovhcloud.com/',
    marketplace: 'https://marketplace.ovhcloud.com/',
    cloud_changelog,
    hosting_and_collab_changelog,
  },
  CA: {
    help: {
      ASIA: `${helpRoot}/asia${homeIndex}`,
      AU: `${helpRoot}/en-au${homeIndex}`,
      CA: `${helpRoot}/en-ca${homeIndex}`,
      QC: `${helpRoot}/fr-ca${homeIndex}`,
      SG: `${helpRoot}/en-sg${homeIndex}`,
      WE: `${helpRoot}/en${homeIndex}`,
      WS: `${helpRoot}/es${homeIndex}`,
    },
    support,
    status: 'https://www.status-ovhcloud.com/',
    cloud_changelog,
    hosting_and_collab_changelog,
  },
  US: {
    help: {
      US: 'https://us.ovhcloud.com/support',
    },
    status: 'https://status.us.ovhcloud.com/',
    cloud_changelog,
    hosting_and_collab_changelog,
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
      if(!url) return;
      return typeof url === 'string' ? (id === 'support' ? url + user.ovhSubsidiary : url) : url[user.ovhSubsidiary];
    },
  };
}

export default { useURL };
