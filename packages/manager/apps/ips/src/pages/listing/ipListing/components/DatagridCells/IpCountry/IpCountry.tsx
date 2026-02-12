import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import { useGetIpdetails } from '@/data/hooks/ip';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for IP Campus (country)
 * If ip has no campus display "-"
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpCountry: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const { t } = useTranslation(TRANSLATION_NAMESPACES.regionSelector);
  const { ipDetails, loading } = useGetIpdetails({ ip });

  if (parentIpGroup) {
    return <></>;
  }

  return (
    <SkeletonCell loading={loading}>
      {ipDetails?.country ? (
        t(`region-selector-country-name_${ipDetails?.country?.toUpperCase()}`)
      ) : (
        <>-</>
      )}
    </SkeletonCell>
  );
};
