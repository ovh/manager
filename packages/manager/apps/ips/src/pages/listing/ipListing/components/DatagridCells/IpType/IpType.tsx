import { useTranslation } from 'react-i18next';

import {
  Text,
  TEXT_PRESET,
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
} from '@ovhcloud/ods-react';
import { ColumnDef } from '@tanstack/react-table';

import { IpTypeEnum } from '@/data/constants';
import { useGetIpdetails } from '@/data/hooks/ip';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { IpRowData } from '../enableCellsUtils';

/**
 * Component to display the cell content for IP Type
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpType: ColumnDef<IpRowData>['cell'] = ({ row }) => {
  const { ip, parentIpGroup } = row.original;
  const ipToFetch = parentIpGroup || ip;
  const { ipDetails, loading } = useGetIpdetails({ ip: ipToFetch });
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);

  return (
    <SkeletonCell loading={loading}>
      <div className="grid justify-items-start gap-2">
        <Text preset={TEXT_PRESET.paragraph}>
          {ipDetails?.type ? t(`listingColumnsType_${ipDetails.type}`) : <>-</>}
        </Text>
        <div className="flex gap-2">
          {ipDetails?.type === IpTypeEnum.ADDITIONAL &&
            !!ipDetails?.routedTo?.serviceName && (
              <Badge size={BADGE_SIZE.sm} color={BADGE_COLOR.success}>
                {t('listingColumnsTypeBadgeAssigned')}
              </Badge>
            )}
          {ipDetails?.type === IpTypeEnum.ADDITIONAL &&
            !ipDetails?.routedTo?.serviceName && (
              <Badge size={BADGE_SIZE.sm} color={BADGE_COLOR.neutral}>
                {t('listingColumnsTypeBadgeParked')}
              </Badge>
            )}
          {ipDetails?.bringYourOwnIp && (
            <Badge size={BADGE_SIZE.sm} color={BADGE_COLOR.information}>
              {t('listingColumnsTypeBadgeByoip')}
            </Badge>
          )}
        </div>
      </div>
    </SkeletonCell>
  );
};
