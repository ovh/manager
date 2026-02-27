import { IamServiceAccount } from '@/data/api/iam-service-accounts';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { useGetIamPoliciesForIdentity } from '@/data/hooks/useGetIamPolicies';

export const ServiceAccountsPolicyCount = ({
  account,
}: {
  account: IamServiceAccount;
}) => {
  const { data: policies, isLoading } = useGetIamPoliciesForIdentity(
    account.identity,
  );

  if (account.identity && isLoading) {
    return (
      <div className="w-8">
        <OdsSkeleton className="w-full" />
      </div>
    );
  }

  return (
    <OdsText>
      {account.identity && policies.length > 0 ? policies.length : '--'}
    </OdsText>
  );
};
