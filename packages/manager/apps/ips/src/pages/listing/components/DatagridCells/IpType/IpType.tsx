import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { useGetIpdetails } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { IpTypeEnum } from '@/data/api';

export type IpTypeProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Type
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpType = ({ ip }: IpTypeProps) => {
  const { ipDetails, isLoading } = useGetIpdetails({ ip });
  const { t } = useTranslation('listing');

  return (
    <SkeletonCell isLoading={isLoading}>
      {ipDetails?.type ? t(`listingColumnsType_${ipDetails.type}`) : <>-</>}
      {ipDetails?.type === IpTypeEnum.ADDITIONAL &&
        !!ipDetails?.routedTo?.serviceName && (
          <OdsBadge
            label={t('listingColumnsTypeBadgeAssigned')}
            size={ODS_BADGE_SIZE.sm}
            color={ODS_BADGE_COLOR.success}
            className="ml-2"
          />
        )}
      {ipDetails?.type === IpTypeEnum.ADDITIONAL &&
        !ipDetails?.routedTo?.serviceName && (
          <OdsBadge
            label={t('listingColumnsTypeBadgeParked')}
            size={ODS_BADGE_SIZE.sm}
            color={ODS_BADGE_COLOR.neutral}
            className="ml-2"
          />
        )}
    </SkeletonCell>
  );
};
