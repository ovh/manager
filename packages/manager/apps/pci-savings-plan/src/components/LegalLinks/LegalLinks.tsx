import { LinkType, Links } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

const LegalLinks = () => {
  const { t } = useTranslation('create');
  const links = [
    {
      label: t('legal_eula_microsoft'),
      href:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/93af107-EULA_MCSFT_VPS_PCI-ALL-1.0.pdf',
    },
    {
      label: t('legal_conditions_generales_de_service'),
      href:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/2f391d2-contrat_genServices-FR-14.1.pdf',
    },
    {
      label: t('legal_data_protection_agreement'),
      href:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/7ce0301-OVH_Data_Protection_Agreement-FR-6.2.pdf',
    },
    {
      label: t('legal_conditions_particulieres'),
      href:
        'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/32ba308-Conditions_particulieres_OVH_Stack-FR-15.0.pdf',
    },
  ];

  return (
    <>
      {links.map((link) => (
        <Links
          label={link.label}
          href={link.href}
          type={LinkType.external}
          target={OdsHTMLAnchorElementTarget._blank}
        />
      ))}
    </>
  );
};

export default LegalLinks;
