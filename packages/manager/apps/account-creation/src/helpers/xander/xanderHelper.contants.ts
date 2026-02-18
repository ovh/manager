import { Country, Subsidiary } from '@ovh-ux/manager-config';

export const XANDER_CNIN_MANDATORY_COUNTRIES: Partial<Record<
  Subsidiary,
  Partial<Record<Country, boolean>>
>> = {
  FR: {
    FR: true,
    BL: true,
    GF: true,
    GP: true,
    MF: true,
    MQ: true,
    NC: true,
    PF: true,
    PM: true,
    RE: true,
    WF: true,
    YT: true,
  },
};
