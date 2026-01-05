import { Region } from '@ovh-ux/manager-config';
import type { HelpPath } from './useHelpLink.type';
export const HELP_ROOT = 'https://help.ovhcloud.com/csm';


export const HELP_INDEX_PATHS: HelpPath = {
  EU: {
    DE: `de-home?id=csm_index`,
    ES: `es-home?id=csm_index`,
    FR: `fr-home?id=csm_index`,
    GB: `en-gb-home?id=csm_index`,
    IE: `en-ie-home?id=csm_index`,
    IT: `it-home?id=csm_index`,
    MA: `fr-ma-home?id=csm_index`,
    NL: `en-ie-home?id=csm_index`,
    PL: `pl-home?id=csm_index`,
    PT: `pt-home?id=csm_index`,
    SN: `fr-sn-home?id=csm_index`,
    TN: `fr-tn-home?id=csm_index`,
  },
  CA: {
    ASIA: `asia-home?id=csm_index`,
    AU: `en-au-home?id=csm_index`,
    CA: `en-ca-home?id=csm_index`,
    QC: `fr-ca-home?id=csm_index`,
    SG: `en-sg-home?id=csm_index`,
    WE: `en-home?id=csm_index`,
    WS: `es-home?id=csm_index`,
  },
  US: {
    US: 'https://us.ovhcloud.com/support',
  },
};
