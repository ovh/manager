import { Region } from '@ovh-ux/manager-config';

const helpRoot = 'https://help.ovhcloud.com/csm';
const homeIndex = '-home?id=csm_index';
const createTicketSupportIndex = '?id=csm_get_help';
const ticketsSupportIndex = '?id=csm_cases_requests';
const supportSubsidiary = 'ovhSubsidiary=';

const cloudChangelog = 'https://github.com/orgs/ovh/projects/16/views/6';
const hostingAndCollabChangelog =
  'https://github.com/orgs/ovh/projects/18/views/2';

interface UsefulLinks {
  help: {
    [key in string]: string;
  };
  support?: {
    createTicket: (sub: string) => string;
    tickets: (sub: string) => string;
  };
  tasks: string;
  cloud_changelog?: string;
  hosting_and_collab_changelog?: string;
}
type UsefulLinkConstants = {
  [key in Region]: UsefulLinks;
};

const consts: UsefulLinkConstants = {
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
    support: {
      createTicket: (sub: string) =>
        `${helpRoot}${createTicketSupportIndex}&${supportSubsidiary}${sub}`,
      tickets: (sub: string) =>
        `${helpRoot}${ticketsSupportIndex}&${supportSubsidiary}${sub}`,
    },
    tasks: 'https://www.status-ovhcloud.com/',
    cloud_changelog: cloudChangelog,
    hosting_and_collab_changelog: hostingAndCollabChangelog,
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
    support: {
      createTicket: (sub: string) =>
        `${helpRoot}${createTicketSupportIndex}&${supportSubsidiary}${sub}`,
      tickets: (sub: string) =>
        `${helpRoot}${ticketsSupportIndex}&${supportSubsidiary}${sub}`,
    },
    tasks: 'https://www.status-ovhcloud.com/',
    cloud_changelog: cloudChangelog,
    hosting_and_collab_changelog: hostingAndCollabChangelog,
  },
  US: {
    help: {
      US: 'https://us.ovhcloud.com/support',
    },
    tasks: '',
    cloud_changelog: cloudChangelog,
    hosting_and_collab_changelog: hostingAndCollabChangelog,
  },
};

export default consts;
