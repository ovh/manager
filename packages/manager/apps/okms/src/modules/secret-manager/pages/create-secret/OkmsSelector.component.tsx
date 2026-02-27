import { Suspense } from 'react';

import { OKMS } from '@key-management-service/types/okms.type';
import { useTranslation } from 'react-i18next';

import { Message, Skeleton, Text } from '@ovhcloud/ods-react';

import { useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { TagsList } from '@ovh-ux/muk';

import { OkmsServiceState } from '@/common/components/okms-service-state-badge/OkmsServiceStateBadge.component';
import { RadioCard } from '@/common/components/radio-card/RadioCard.component';

import { ActivateRegion } from './ActivateRegion.component';

const OkmsStatus = ({ id }: { id: string }) => {
  const {
    data: OkmsServiceInfos,
    isPending,
    isError,
  } = useServiceDetails({
    resourceName: id,
  });

  if (isPending) return <Skeleton />;

  if (isError) return null;

  return <OkmsServiceState state={OkmsServiceInfos.data.resource.state} size="sm" />;
};

type OkmsSelectorProps = {
  okmsList: OKMS[];
  selectedOkms: string | undefined;
  selectedRegion: string | undefined;
  onOkmsSelection: (okmsId: string) => void;
};

export const OkmsSelector = ({
  okmsList,
  selectedOkms,
  selectedRegion,
  onOkmsSelection,
}: OkmsSelectorProps) => {
  const { t } = useTranslation('secret-manager');

  // If no region is selected, do not display the selector
  // If there is only one OKMS, do not display the selector
  if (!selectedRegion || okmsList.length === 1) {
    return null;
  }

  if (okmsList.length === 0) {
    return (
      <div className="space-y-3">
        <Message color="warning" dismissible={false}>
          {t('create_secret_form_okms_not_selected')}
        </Message>
        <ActivateRegion selectedRegion={selectedRegion} />
      </div>
    );
  }

  return (
    <Suspense>
      <div className="flex flex-col gap-3">
        <Text preset="heading-4">{t('create_secret_form_okms_selector_title')}</Text>
        <div className="space-y-3">
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
    </Suspense>
  );
};
