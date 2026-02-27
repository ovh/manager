import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { OrgDetails } from '@/data/api/get/organisationsDetails';
import { useIpFeatureAvailability } from '@/utils/ipFeatureAvailbility';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { ColumnDef } from '@tanstack/react-table';

export const OrganisationsAddressCell: ColumnDef<OrgDetails>['cell'] = ({
  row,
}) => {
  const { address, country, city, state, zip } = row.original;
  const { t } = useTranslation(TRANSLATION_NAMESPACES.regionSelector);
  const { showState } = useIpFeatureAvailability();

  const formatedAddress = useMemo(() => {
    const countryLabel = t(`region-selector-country-name_${country}`);

    return showState
      ? [address, city, state ?? '', zip ?? '', countryLabel]
          .filter(Boolean)
          .join(' ')
      : [address, zip ?? '', city ?? '', countryLabel]
          .filter(Boolean)
          .join(' ');
  }, [showState, address, city, state, zip, country, t]);

  return <Text preset={TEXT_PRESET.paragraph}>{formatedAddress}</Text>;
};
