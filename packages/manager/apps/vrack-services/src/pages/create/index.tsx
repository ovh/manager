import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  OrderDescription,
  getDeliveringOrderQueryKey,
} from '@ovh-ux/manager-module-order';
import {
  getvrackServicesReferenceRegionList,
  getvrackServicesReferenceRegionListQueryKey,
  Region,
} from '@/api';
import { ErrorPage } from '@/components/Error';
import { RegionFormField } from './components/RegionFormField';
import { CreatePageLayout } from '@/components/layout-helpers';
import { displayNameInputName } from './constants';
import { VrackConfirmModal } from './components/VrackConfirmModal';
import { urls } from '@/router/constants';

const CreationPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { t } = useTranslation('vrack-services/create');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
        dataTrackingPath="add"
        createButtonDataTracking={`::${selectedRegion}::confim`}
        onSubmit={() => setIsModalVisible(true)}
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
      <VrackConfirmModal
        displayName={displayName}
        selectedRegion={selectedRegion}
        dataTrackingPath="add"
        denyDataTracking="::create-vrack"
        confirmDataTracking="::create-vrack-services"
        onCancel={() => setIsModalVisible(false)}
        onDeny={() => {
          setIsModalVisible(false);
          queryClient.invalidateQueries({
            queryKey: getDeliveringOrderQueryKey(
              OrderDescription.vrackServices,
            ),
          });
          navigate(urls.listing);
        }}
        onConfirm={() => {
          setIsModalVisible(false);
          queryClient.invalidateQueries({
            queryKey: getDeliveringOrderQueryKey(
              OrderDescription.vrackServices,
            ),
          });
          queryClient.invalidateQueries({
            queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
          });
          navigate(urls.listing);
        }}
        isModalVisible={isModalVisible}
      />
    </>
  );
};

export default CreationPage;
