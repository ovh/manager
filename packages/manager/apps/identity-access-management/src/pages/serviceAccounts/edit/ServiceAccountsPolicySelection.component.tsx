import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import {
  OdsText,
  OdsLink,
  OdsMessage,
  OdsFormField,
  OdsCheckbox,
  OdsIcon,
  OdsTooltip,
  OdsInput,
  OdsSpinner,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_PRESET,
  ODS_MESSAGE_COLOR,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';

import { IamPolicy } from '@/data/api/iam-policies';
import { IamServiceAccount } from '@/data/api/iam-service-accounts';
import { ServiceAccountsPolicyTile } from '@/pages/serviceAccounts/components/ServiceAccountsPolicyTile.component';

export const ServiceAccountsPolicySelection = ({
  allPolicies,
  selectedPolicies,
  onPolicySelectionChange,
  isLoading,
}: {
  serviceAccount: IamServiceAccount | null;
  allPolicies: IamPolicy[];
  selectedPolicies: IamPolicy[];
  onPolicySelectionChange: (policy: IamPolicy, selected: boolean) => void;
  isLoading: boolean;
}) => {
  const { t } = useTranslation('service-accounts');
  const [search, setSearch] = useState<string>('');
  const displayedPolicies = useMemo(() => {
    if (!allPolicies || !allPolicies.length) {
      return [];
    }
    if (!search) {
      return allPolicies;
    }
    return (allPolicies || []).filter((policy: IamPolicy) => {
      const nameMatch = (policy.name || '').includes(search);
      const descriptionMatch = (policy.name || '').includes(search);
      return nameMatch || descriptionMatch;
    });
  }, [allPolicies, search]);
  const selectedPoliciesDict: Record<string, boolean> = useMemo(() => {
    return selectedPolicies.reduce(
      (acc, policy) => ({ ...acc, [policy.id]: true }),
      {},
    );
  }, [selectedPolicies]);
  const { data: createPolicyHref } = useNavigationGetUrl([
    'iam',
    '/policies/myPolicies/create',
    {},
  ]);

  const header = (
    <>
      <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading3}>
        {t('iam_service_accounts_policies')}
      </OdsText>
      <OdsText className="mb-4">
        {t('iam_service_accounts_optional_step')}
      </OdsText>
    </>
  );

  if (isLoading) {
    return (
      <>
        {header}
        <OdsSpinner />
      </>
    );
  }

  if (!allPolicies.length) {
    return (
      <>
        {header}
        <OdsMessage
          className="mt-8"
          color={ODS_MESSAGE_COLOR.information}
          isDismissible={false}
        >
          <div className="flex flex-col gap-2">
            <OdsText preset={ODS_TEXT_PRESET.heading5}>
              {t('iam_service_accounts_no_policies_title')}
            </OdsText>
            <OdsText>
              {t('iam_service_accounts_no_policies_description')}
            </OdsText>
            <OdsLink
              href={createPolicyHref as string}
              label={t('iam_service_accounts_create_policy')}
              icon={ODS_ICON_NAME.externalLink}
            />
          </div>
        </OdsMessage>
      </>
    );
  }

  return (
    <>
      {header}
      <div className="mt-8">
        <OdsInput
          className="w-full"
          type="search"
          name="policySearch"
          value={search}
          onOdsChange={(e) => setSearch(e.detail.value as string)}
          data-testId="policySearch"
        />
        <div className="policy-tile-grid">
          {displayedPolicies.map((policy: IamPolicy) => (
            <ServiceAccountsPolicyTile
              key={policy.id}
              policy={policy}
              selected={!!selectedPoliciesDict[policy.id]}
              setSelected={onPolicySelectionChange}
            />
          ))}
        </div>
      </div>
    </>
  );
};
