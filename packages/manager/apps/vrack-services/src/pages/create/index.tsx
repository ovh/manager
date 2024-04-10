import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  OsdsInput,
  OsdsText,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getvrackServicesReferenceRegionList,
  getvrackServicesReferenceRegionListQueryKey,
  Region,
} from '@/api';
import { ErrorPage } from '@/components/Error';
import { RegionFormField } from './components/RegionFormField';
import { CreatePageLayout } from '@/components/layout-helpers';
import { displayNameInputName } from './constants';
import { urls } from '@/router/constants';

export default function CreationPage() {
  const [selectedRegion, setSelectedRegion] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const { t } = useTranslation('vrack-services/create');
  const navigate = useNavigate();

  const {
    isLoading: isRegionLoading,
    isError: hasRegionError,
    error,
  } = useQuery<ApiResponse<Region[]>, ApiError>({
    queryKey: getvrackServicesReferenceRegionListQueryKey,
    queryFn: getvrackServicesReferenceRegionList,
    staleTime: Infinity,
  });

  if (hasRegionError) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <CreatePageLayout
        createButtonLabel={t('createButtonLabel')}
        confirmActionsTracking={['activate_vrack-service', selectedRegion]}
        onSubmit={() =>
          navigate(urls.createConfirm.replace(':region', selectedRegion), {
            state: { displayName },
          })
        }
        title={t('title')}
        isFormSubmittable={!isRegionLoading && !!selectedRegion}
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
            name={displayNameInputName}
            size={ODS_INPUT_SIZE.md}
            type={ODS_INPUT_TYPE.text}
            placeholder={t('displayNamePlaceholder')}
            onOdsValueChange={(e: OdsInputValueChangeEvent) =>
              setDisplayName(e?.detail.value || '')
            }
          />
        </OsdsFormField>
        <RegionFormField
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
      </CreatePageLayout>
      <Outlet />
    </>
  );
}
