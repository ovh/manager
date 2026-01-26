import { useTranslation } from 'react-i18next';

import { Badge, BADGE_COLOR, BADGE_SIZE } from '@ovhcloud/ods-react';

import { IpTypeEnum } from '@/data/constants';
import { useGetIpdetails } from '@/data/hooks/ip';

import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { TRANSLATION_NAMESPACES } from '@/utils';

export type IpTypeProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Type
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpType = ({ ip }: IpTypeProps) => {
  const { ipDetails, loading } = useGetIpdetails({ ip });
  const { t } = useTranslation(TRANSLATION_NAMESPACES.listing);

  return (
    <SkeletonCell loading={loading}>
      <div className="flex flex-wrap items-center gap-4">
        {ipDetails?.type ? t(`listingColumnsType_${ipDetails.type}`) : <>-</>}
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
    </SkeletonCell>
  );
};
