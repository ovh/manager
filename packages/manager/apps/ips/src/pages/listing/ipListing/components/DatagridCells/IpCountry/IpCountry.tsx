import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGetIpdetails } from '@/data/hooks/ip';
import { SkeletonCell } from '../SkeletonCell/SkeletonCell';

export type IpCountryProps = {
  ip: string;
};

/**
 * Component to display the cell content for IP Campus (country)
 * If ip has no campus display "-"
 * @param ip the ip with mask
 * @returns React Component
 */
export const IpCountry = ({ ip }: IpCountryProps) => {
  const { ipDetails, isLoading } = useGetIpdetails({ ip });
  const { t } = useTranslation('region-selector');

  return (
    <SkeletonCell isLoading={isLoading}>
      {ipDetails?.country ? (
        t(`region-selector-country-name_${ipDetails?.country}`)
      ) : (
        <>-</>
      )}
    </SkeletonCell>
  );
};
