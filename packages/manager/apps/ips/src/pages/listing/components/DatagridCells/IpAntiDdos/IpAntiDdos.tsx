import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpdetails, useGetIpMitigation } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';
import { ListingContext } from '@/pages/listing/listingContext';

export type IpAntiDdosProps = {
  ip: string;
};

/**
 * Component to display the cell content for Anti DDOS.
 * If ip is not /32 (isGroup = true) or not ipv4, we display nothing.
 * If ip mitigation is Permanent we display permanent if no mitigation or not permanent, we display automatic
 * @param ip the ip with mask
 * @returns React component
 */
export const IpAntiDdos = ({ ip }: IpAntiDdosProps) => {
  const { expiredIps } = useContext(ListingContext);
  const { t } = useTranslation('listing');

  // Check if ip is not a group
  const { isGroup } = ipFormatter(ip);

  // Get ip details
  const { ipDetails, isLoading: isDetailsLoading } = useGetIpdetails({
    ip,
    enabled: !isGroup,
  });

  // get ip mitigation only if ip is ipv4
  const enabled =
    expiredIps.indexOf(ip) === -1 &&
    !isDetailsLoading &&
    ipDetails?.version === 4;

  const { ipMitigation, isLoading, error } = useGetIpMitigation({
    ip,
    enabled,
  });

  return (
    <SkeletonCell
      isLoading={isLoading || isDetailsLoading}
      enabled={!isGroup}
      error={error}
    >
      {enabled && !ipMitigation?.length && (
        <div>{t('listingColumnsIpAntiDDosAutomatic')}</div>
      )}
      {enabled &&
        ipMitigation?.map((mitigation) => {
          return (
            <div key={mitigation.ipOnMitigation}>
              {mitigation.permanent
                ? t('listingColumnsIpAntiDDosPermanent')
                : t('listingColumnsIpAntiDDosAutomatic')}
            </div>
          );
        })}
    </SkeletonCell>
  );
};
