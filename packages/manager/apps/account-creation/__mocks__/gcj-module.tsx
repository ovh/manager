import React from 'react';

export const usePrivacyPolicyLink = () => 'https://fake-link.com';

type DataUsagePolicyProps = {
  subsidiary: string;
  region: string;
};

export const DataUsagePolicy = ({ subsidiary, region }: DataUsagePolicyProps) => (
  <div data-testid="data-usage-policy">
    {subsidiary}-{region}
  </div>
);
