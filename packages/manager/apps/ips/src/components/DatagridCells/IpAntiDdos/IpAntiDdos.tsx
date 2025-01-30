import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ipFormatter } from '@/utils/ipFormatter';
import { useGetIpdetails, useGetIpMitigation } from '@/data/hooks/ip';

export type IpAntiDdosProps = {
  ipGroup: string;
};

/**
 * Component to display the cell content for Anti DDOS.
 * If ip is not /32 (isGroup = true) or not ipv4, we display nothing.
 * If ip mitigation is Permanent we display permanent if no mitigation or not permanent, we display automatic
 * @param ipGroup the ip with mask
 * @returns React component
 */
export const IpAntiDdos = ({ ipGroup }: IpAntiDdosProps) => {
  const { t } = useTranslation('listing');

  // Check if ip is not a group
  const { isGroup } = ipFormatter(ipGroup);

  // Get ip details
  const { ipDetails, isLoading: isDetailsLoading } = useGetIpdetails({
    ip: ipGroup,
    enabled: !isGroup,
  });

  // get ip mitigation only if ip is ipv4
  const enabled = !isDetailsLoading && ipDetails?.version === 4;
  const { ipMitigation, isLoading } = useGetIpMitigation({ ipGroup, enabled });

  if (isGroup) return null;
  if (isDetailsLoading || isLoading) return <OdsSkeleton></OdsSkeleton>;
  if (!isDetailsLoading && !enabled) return null;
  if (!ipMitigation?.length)
    return <div>{t('listingColumnsIpAntiDDosAutomatic')}</div>;

  return (
    <>
      {ipMitigation.map((mitigation) => {
        return (
          <div key={mitigation.ipOnMitigation}>
            {mitigation.permanent
              ? t('listingColumnsIpAntiDDosPermanent')
              : t('listingColumnsIpAntiDDosAutomatic')}
          </div>
        );
      })}
    </>
  );
};
