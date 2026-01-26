import React from 'react';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { OrgDetails } from '@/data/api/get/organisationsDetails';
import { useIpFeatureAvailability } from '@/utils/ipFeatureAvailbility';

export const OrganisationsAddressCell: React.FC<OrgDetails> = (address) => {
  const { t } = useTranslation('region-selector');
  const { showState } = useIpFeatureAvailability();

  const formatAddress = (addressObj: OrgDetails) => {
    const country = t(`region-selector-country-name_${addressObj.country}`);

    if (showState()) {
      return [
        addressObj.address,
        addressObj.city,
        addressObj.state ? addressObj.state : '',
        addressObj.zip ? addressObj.zip : '',
        country,
      ]
        .filter(Boolean)
        .join(' ');
    }

    return [
      addressObj.address,
      addressObj.zip ? addressObj.zip : '',
      addressObj.city,
      country,
    ]
      .filter(Boolean)
      .join(' ');
  };

  return <Text preset={TEXT_PRESET.paragraph}>{formatAddress(address)}</Text>;
};

export default OrganisationsAddressCell;
