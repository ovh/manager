import { Region } from '@ovh-ux/manager-config';

const helpRoot = 'https://help.ovhcloud.com';

interface UsefulLinks {
  help: {
    [key in string]: string;
  };
  tasks: string;
}
type UsefulLinkConstants = {
  [key in Region]: UsefulLinks;
};

const consts: UsefulLinkConstants = {
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
    tasks: 'https://www.status-ovhcloud.com/',
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
    tasks: 'https://www.status-ovhcloud.com/',
  },
  US: {
    help: {
      US: 'https://us.ovhcloud.com/support',
    },
    tasks: '',
  },
};

export default consts;
