import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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
import {
  useEnvironment,
  useTracking,
} from '@ovh-ux/manager-react-shell-client';
import { CountryCode } from '@ovh-ux/manager-config';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getvrackServicesReferenceRegionList,
  getvrackServicesReferenceRegionListQueryKey,
  orderVrackServices,
  orderVrackServicesQueryKey,
  orderVrack,
  orderVrackQueryKey,
  getDeliveringOrderQueryKey,
  OrderDescription,
  Region,
  Order,
} from '@/api';
import { ErrorPage } from '@/components/Error';
import { RegionFormField } from './components/RegionFormField';
import { CreatePageLayout } from '@/components/layout-helpers';
import { displayNameInputName } from './constants';
import { VrackConfirmModal } from './components/VrackConfirmModal';

const CreationPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [shouldOrderVrack, setShouldOrderVrack] = React.useState(false);
  const environment = useEnvironment();
  const user = environment.getUser();
  const { t } = useTranslation('vrack-services/create');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tracking = useTracking();

  const {
    isLoading: isRegionLoading,
    isError: hasRegionError,
    error,
  } = useQuery<ApiResponse<Region[]>, ApiError>({
    queryKey: getvrackServicesReferenceRegionListQueryKey,
    queryFn: getvrackServicesReferenceRegionList,
    staleTime: Infinity,
  });

  const {
    mutate: orderNewVrackServices,
    isPending: isCreationPending,
    isError: isCreationError,
    error: vsCreationError,
  } = useMutation<ApiResponse<Order>, ApiError>({
    mutationFn: () =>
      orderVrackServices({
        displayName,
        selectedRegion,
        ovhSubsidiary: user.ovhSubsidiary as CountryCode,
      }),
    mutationKey: orderVrackServicesQueryKey,
    onSuccess: async () => {
      if (shouldOrderVrack) {
        try {
          await orderVrack({
            ovhSubsidiary: user.ovhSubsidiary as CountryCode,
          });
          await tracking.trackEvent({
            name: 'vrack-services::add::create-vrack-success',
            level2: '0',
          });
          await queryClient.invalidateQueries({
            queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
          });
        } catch {
          await tracking.trackEvent({
            name: 'vrack-services::add::create-vrack-error',
            level2: '0',
          });
        }
      }
      await queryClient.invalidateQueries({
        queryKey: getDeliveringOrderQueryKey(OrderDescription.vrackServices),
      });
      await tracking.trackEvent({
        name: 'vrack-services::add-success',
        level2: '0',
      });
      navigate('/');
    },
    onError: async () => {
      await tracking.trackEvent({
        name: 'vrack-services::add-error',
        level2: '0',
      });
    },
  });

  React.useEffect(() => {
    tracking.trackPage({
      name: 'vrack-services::add',
      level2: '0',
    });
    queryClient.invalidateQueries({ queryKey: orderVrackQueryKey });
    queryClient.invalidateQueries({ queryKey: orderVrackServicesQueryKey });
  }, []);

  if (hasRegionError) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <CreatePageLayout
        createButtonLabel={t('createButtonLabel')}
        createButtonDataTracking={`vrack-services::add::${selectedRegion}::confim`}
        formErrorMessage={t('creationServiceError', {
          error: vsCreationError?.response?.data.message,
          interpolation: { escapeValue: false },
        })}
        hasFormError={isCreationError}
        onSubmit={() => setIsModalVisible(true)}
        title={t('title')}
        isSubmitPending={isCreationPending}
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
            disabled={isCreationPending || undefined}
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
          isReadOnly={isCreationPending}
        />
      </CreatePageLayout>
      <VrackConfirmModal
        confirmDataTracking="vrack-services::add::create-vrack"
        onCancel={() => setIsModalVisible(false)}
        onDeny={() => {
          setShouldOrderVrack(false);
          orderNewVrackServices();
          setIsModalVisible(false);
          queryClient.invalidateQueries({
            queryKey: getDeliveringOrderQueryKey(
              OrderDescription.vrackServices,
            ),
          });
        }}
        onConfirm={() => {
          setShouldOrderVrack(true);
          orderNewVrackServices();
          setIsModalVisible(false);
          queryClient.invalidateQueries({
            queryKey: getDeliveringOrderQueryKey(
              OrderDescription.vrackServices,
            ),
          });
        }}
        isModalVisible={isModalVisible}
      />
    </>
  );
};

export default CreationPage;
