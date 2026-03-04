import { useContext } from 'react';

import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';

import {
  BADGE_COLOR,
  Badge,
  Skeleton,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { useGetIpdetails } from '@/data/hooks/ip';
import { ListingContext } from '@/pages/listing/listingContext';
import { isValidIpv6Block, TRANSLATION_NAMESPACES } from '@/utils';
import { ipFormatter } from '@/utils/ipFormatter';
import { IpRowData } from '../enableCellsUtils';
import { IpAlerts } from '../IpAlerts/IpAlerts';

/**
 * Component to display the cell content for IP Address
 * if ip has /32 mask, do not display it ex: 10.0.0.1/32 -> 10.0.0.1
 * if ip has mask other than /32 display it ex: 10.0.0.1/24 -> 10.0.0.1/24
 * If ip has description, we display it under
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpCell: ColumnDef<IpRowData>['cell'] = (props) => {
  const { ip, parentIpGroup } = props.row.original;
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);
  const {
    onGoingAggregatedIps,
    onGoingSlicedIps,
    onGoingCreatedIps,
  } = useContext(ListingContext);
  const { ipDetails, loading } = useGetIpdetails({ ip: parentIpGroup || ip });

  if (isValidIpv6Block(parentIpGroup) && !ip) {
    return <div>Aucune ip</div>;
  }

  return (
    <div className={parentIpGroup ? 'pl-5' : ''}>
      <Text
        className="block"
        preset={parentIpGroup ? TEXT_PRESET.small : TEXT_PRESET.paragraph}
      >
        {ipFormatter(ip).ip}
      </Text>
      {loading && (
        <div className="mt-2">
          <Skeleton />
        </div>
      )}
      {!loading && !parentIpGroup && !!ipDetails?.description && (
        <small className="mt-2 inline-block">{ipDetails?.description}</small>
      )}
      <div className="mt-2">
        {onGoingAggregatedIps.includes(ip) && (
          <Badge color={BADGE_COLOR.information}>
            {t('aggregate_in_progress')}
          </Badge>
        )}
        {onGoingSlicedIps.includes(ip) && (
          <Badge color={BADGE_COLOR.information}>
            {t('slice_in_progress')}
          </Badge>
        )}
        {onGoingCreatedIps.includes(ip) && (
          <Badge color={BADGE_COLOR.information}>
            {t('creation_in_progress')}
          </Badge>
        )}
      </div>
      <IpAlerts {...props} />
    </div>
  );
};
