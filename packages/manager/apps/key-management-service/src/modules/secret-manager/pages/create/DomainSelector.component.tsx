import React from 'react';
import { useTranslation } from 'react-i18next';
import { TagsList, useServiceDetails } from '@ovh-ux/manager-react-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OKMS } from '@/types/okms.type';
import { OkmsServiceState } from '@/components/layout-helpers/Dashboard/okmsServiceState/OkmsServiceState.component';
import { RadioCard } from '@/common/components/RadioCard/RadioCard.component';
import { ActivateRegion } from './ActivateRegion.component';

const DomainStatus = ({ id }: { id: string }) => {
  const { data: OkmsServiceInfos, isLoading, isError } = useServiceDetails({
    resourceName: id,
  });

  if (isLoading) return <OdsSkeleton />;

  if (isError) return null;

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
  selectedRegion: string;
  isOkmsOrderProcessing: boolean;
  onDomainSelection: (domainId: string) => void;
};

export const DomainSelector = ({
  domains,
  selectedDomain,
  selectedRegion,
  isOkmsOrderProcessing,
  onDomainSelection,
}: DomainSelectorProps) => {
  const { t } = useTranslation('secret-manager/create');

  if (!selectedRegion || domains.length === 1) return null;

  if (domains.length === 0) {
    return (
      <ActivateRegion
        isOkmsOrderProcessing={isOkmsOrderProcessing}
        selectedRegion={selectedRegion}
      />
    );
  }

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
    </div>
  );
};
