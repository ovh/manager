import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OsdsFormField } from '@ovhcloud/ods-components/form-field/react';
import {
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components/input';
import { OsdsInput } from '@ovhcloud/ods-components/input/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  getvrackServicesReferenceZoneListQueryKey,
  getvrackServicesReferenceZoneList,
  orderVrackServices,
  orderVrackServicesQueryKey,
} from '../../api';
import { BreadcrumbHandleParams } from '../../components/Breadcrumb/Breadcrumb';
import { ApiError, ErrorBanner } from '../../components/Error/Error';
import { ZoneFormField } from './ZoneFormField';
import { CreatePageLayout } from '@/components/layout-helpers';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

const inputNames = {
  displayName: 'displayName',
  zone: 'zone',
};

const CreationPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const { t } = useTranslation('vrack-services/create');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading: isZoneLoading, status } = useQuery({
    queryKey: getvrackServicesReferenceZoneListQueryKey,
    queryFn: getvrackServicesReferenceZoneList,
    staleTime: Infinity,
  });

  const {
    refetch: orderANewVrackServices,
    isFetching: isCreationPending,
    status: creationStatus,
  } = useQuery({
    queryKey: orderVrackServicesQueryKey,
    queryFn: orderVrackServices({ displayName, selectedZone }),
    refetchOnWindowFocus: false,
    enabled: false,
  });

  if (status === 'success' && data?.status !== 200) {
    return <ErrorBanner error={(data as unknown) as ApiError} />;
  }

  React.useEffect(() => {
    if (creationStatus === 'success') {
      queryClient.removeQueries({ queryKey: orderVrackServicesQueryKey });
      navigate('/', { replace: true });
    }
  });

  return (
    <CreatePageLayout
      createButtonLabel={t('createButtonLabel')}
      formErrorMessage={t('creationServiceError')}
      hasFormError={creationStatus === 'error'}
      goBackLinkLabel={t('goBackLinkLabel')}
      goBackUrl="/"
      onSubmit={() => {
        orderANewVrackServices();
      }}
      title={t('title')}
      isFormSubmittable={!isZoneLoading && !isCreationPending && !!selectedZone}
    >
      <OsdsFormField inline>
        <div slot="label">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
          >
            {t('displayNameLabel')}
          </OsdsText>
        </div>
        <OsdsInput
          inline
          {...(isCreationPending ? { disabled: true } : {})}
          name={inputNames.displayName}
          size={ODS_INPUT_SIZE.md}
          type={ODS_INPUT_TYPE.text}
          placeholder={t('displayNamePlaceholder')}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDisplayName(e?.detail.value || '')
          }
        />
      </OsdsFormField>
      <ZoneFormField
        inputName={inputNames.zone}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        isReadOnly={isCreationPending}
      />
    </CreatePageLayout>
  );
};

export default CreationPage;
