import React from 'react';

export const usePrivacyPolicyLink = () => 'https://fake-link.com';

export const DataUsagePolicy = ({ subsidiary, region }: any) => (
  <div data-testid="data-usage-policy">
    {subsidiary}-{region}
  </div>
);
