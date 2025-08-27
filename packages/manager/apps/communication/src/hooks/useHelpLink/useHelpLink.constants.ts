import { Region } from '@ovh-ux/manager-config';

export const HELP_ROOT = 'https://help.ovhcloud.com/csm';
const homeIndex = '-home?id=csm_index';

type HelpUrl = Record<
  Region,
  {
    [subsidiaryKey: string]: string;
  }
>;

export const HELP_URL: HelpUrl = {
  EU: {
    DE: `${HELP_ROOT}/de${homeIndex}`,
    ES: `${HELP_ROOT}/es${homeIndex}`,
    FR: `${HELP_ROOT}/fr${homeIndex}`,
    GB: `${HELP_ROOT}/en-gb${homeIndex}`,
    IE: `${HELP_ROOT}/en-ie${homeIndex}`,
    IT: `${HELP_ROOT}/it${homeIndex}`,
    MA: `${HELP_ROOT}/fr-ma${homeIndex}`,
    NL: `${HELP_ROOT}/en-ie${homeIndex}`,
    PL: `${HELP_ROOT}/pl${homeIndex}`,
    PT: `${HELP_ROOT}/pt${homeIndex}`,
    SN: `${HELP_ROOT}/fr-sn${homeIndex}`,
    TN: `${HELP_ROOT}/fr-tn${homeIndex}`,
  },
  CA: {
    ASIA: `${HELP_ROOT}/asia${homeIndex}`,
    AU: `${HELP_ROOT}/en-au${homeIndex}`,
    CA: `${HELP_ROOT}/en-ca${homeIndex}`,
    QC: `${HELP_ROOT}/fr-ca${homeIndex}`,
    SG: `${HELP_ROOT}/en-sg${homeIndex}`,
    WE: `${HELP_ROOT}/en${homeIndex}`,
    WS: `${HELP_ROOT}/es${homeIndex}`,
  },
  US: {
    US: 'https://us.ovhcloud.com/support',
  },
};
