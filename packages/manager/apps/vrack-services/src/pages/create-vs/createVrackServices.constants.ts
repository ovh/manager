import { ODS_COUNTRY_ISO_CODE } from '@ovhcloud/ods-common-core';

export const regionInputName = 'region';

export const regionNameToIsoCode: { [prop: string]: ODS_COUNTRY_ISO_CODE } = {
  RBX: ODS_COUNTRY_ISO_CODE.FR,
  LIM: ODS_COUNTRY_ISO_CODE.DE,
  BHS: ODS_COUNTRY_ISO_CODE.CA,
};
