import React from 'react';
import { useTranslation } from 'react-i18next';
import { TagsList, useServiceDetails } from '@ovh-ux/manager-react-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OKMS } from '@/types/okms.type';
import { OkmsServiceState } from '@/components/layout-helpers/Dashboard/okmsServiceState/OkmsServiceState.component';
import { RadioCard } from '@/common/components/RadioCard/RadioCard.component';
import { ActivateRegion } from './ActivateRegion.component';

const OkmsStatus = ({ id }: { id: string }) => {
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

type OkmsSelectorProps = {
  okmsList: OKMS[];
  selectedOkms: string;
  selectedRegion: string;
  isOkmsOrderProcessing: boolean;
  onOkmsSelection: (okmsId: string) => void;
};

export const OkmsSelector = ({
  okmsList,
  selectedOkms,
  selectedRegion,
  isOkmsOrderProcessing,
  onOkmsSelection,
}: OkmsSelectorProps) => {
  const { t } = useTranslation('secret-manager');

  if (!selectedRegion || okmsList.length === 1) return null;

  if (okmsList.length === 0) {
    return (
      <ActivateRegion
        isOkmsOrderProcessing={isOkmsOrderProcessing}
        selectedRegion={selectedRegion}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <OdsText preset="heading-4">
        {t('create_secret_form_okms_selector_title')}
      </OdsText>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {okmsList.map((okms) => (
          <RadioCard
            id={okms.id}
            onChange={(event) => onOkmsSelection(event.target.value)}
            selected={selectedOkms}
            key={okms.id}
            name="okms"
            title={okms.iam.displayName}
            badges={<OkmsStatus id={okms.id} />}
          >
            {okms.iam.tags && Object.keys(okms.iam.tags).length > 0 && (
              <TagsList tags={okms.iam.tags} lineNumber={10} />
            )}
          </RadioCard>
        ))}
      </div>
    </div>
  );
};
