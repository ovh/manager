import { TDsDataInterface } from '../types/dnssecConfiguration';
import { TFunction } from 'i18next';

export const algorithm_RSASHZA3457 = { name: 'RSASHZA3457', number: 3 };
export const domain_dsrecords_key_signing_ksk = 'Key Signing Key (KSK)';
export const flagsValue = 257;
export const supportedAlgorithms = [
  {
    name: 'RSASHA1',
    number: 5,
  },
  {
    name: 'RSASHA1-NSEC3-SHA1',
    number: 7,
  },
  {
    name: 'RSASHA256',
    number: 8,
  },
  {
    name: 'RSASHA512',
    number: 10,
  },
  {
    name: 'ECDSAP256SHA256',
    number: 13,
  },
  {
    name: 'ECDSAP384SHA384',
    number: 14,
  },
  {
    name: 'ED25519',
    number: 15,
  },
];
export const min_keyTag = 0;
export const max_keytag = 65535;

export const drawerTexts = (isAddAction: boolean, t: TFunction<'domain'>) => {
  return isAddAction
    ? {
        heading: t('domain_tab_dsrecords_drawer_add_title'),
        successMessage: (keyTag: TDsDataInterface['keyTag']) =>
          t('domain_tab_dsrecords_drawer_add_success', {
            keyTag,
          }),
        errorMessage: (errorText: string) =>
          t('domain_tab_dsrecords_drawer_add_error', {
            error: errorText,
          }),
      }
    : {
        heading: t('domain_tab_dsrecords_drawer_modify_title'),
        successMessage: (keyTag: TDsDataInterface['keyTag']) =>
          t('domain_tab_dsrecords_drawer_modify_success', {
            keyTag,
          }),
        errorMessage: (errorText: string) =>
          t('domain_tab_dsrecords_drawer_modify_error', {
            error: errorText,
          }),
      };
};

export const formDataValues = (
  isAddAction: boolean,
  keyTag: TDsDataInterface['keyTag'],
  algorithm: TDsDataInterface['algorithm'],
  publicKey: TDsDataInterface['publicKey'],
) => {
  return {
    keyTag: isAddAction ? null : keyTag,
    flags: flagsValue,
    // We set the first value from the api return
    algorithm: isAddAction ? supportedAlgorithms[0]?.number : algorithm,
    publicKey: isAddAction ? '' : publicKey,
  };
};
