import React from 'react';
import { useTranslation } from 'react-i18next';
import { TagsList, useServiceDetails } from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OKMS } from '@/types/okms.type';
import { OkmsServiceState } from '@/components/layout-helpers/Dashboard/okmsServiceState/OkmsServiceState.component';
import { RadioCard } from '@/common/components/RadioCard/RadioCard.component';

const DomainStatus = ({ id }: { id: string }) => {
  const { data: OkmsServiceInfos, isLoading, isError } = useServiceDetails({
    resourceName: id,
  });
  if (isLoading) {
    return <OdsSkeleton />;
  }
  if (isError) {
    return <></>;
  }
  return (
    <OkmsServiceState
      state={OkmsServiceInfos.data.resource.state}
      size={ODS_BADGE_SIZE.sm}
    />
  );
};

type DomainSelectorProps = {
  domains: OKMS[];
  selectedDomain: string;
  onDomainSelection: (domainId: string) => void;
};

export const DomainSelector = ({
  domains,
  onDomainSelection,
  selectedDomain,
}: DomainSelectorProps) => {
  const { t } = useTranslation('secret-manager/create');

  return (
    <div className="flex flex-col gap-3">
      <OdsText preset="heading-4">{t('domain_selector_title')}</OdsText>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {domains.map((domain) => (
          <RadioCard
            id={domain.id}
            onChange={(event) => onDomainSelection(event.target.value)}
            selected={selectedDomain}
            key={domain.id}
            name="domain"
            title={domain.iam.displayName}
            badges={<DomainStatus id={domain.id} />}
          >
            {domain.iam.tags && Object.keys(domain.iam.tags).length > 0 && (
              <TagsList tags={domain.iam.tags} lineNumber={10} />
            )}
          </RadioCard>
        ))}
      </div>
      <div className="flex flex-col">
        <OdsButton label={t('domain_selector_create_domain')} />
      </div>
    </div>
  );
};
