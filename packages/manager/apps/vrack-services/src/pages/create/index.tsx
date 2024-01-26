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
  getvrackServicesReferenceZoneList,
  getvrackServicesReferenceZoneListQueryKey,
  orderVrackServices,
  orderVrackServicesQueryKey,
  orderVrack,
  orderVrackQueryKey,
  getDeliveringOrderQueryKey,
  OrderDescription,
  Zone,
  Order,
} from '@/api';
import { ErrorPage } from '@/components/Error';
import { ZoneFormField } from './components/ZoneFormField';
import { CreatePageLayout } from '@/components/layout-helpers';
import { displayNameInputName } from './constants';
import { VrackConfirmModal } from './components/VrackConfirmModal';

const CreationPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [shouldOrderVrack, setShouldOrderVrack] = React.useState(false);
  const environment = useEnvironment();
  const user = environment.getUser();
  const { t } = useTranslation('vrack-services/create');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tracking = useTracking();

  const { isLoading: isZoneLoading, isError: hasZoneError, error } = useQuery<
    ApiResponse<Zone[]>,
    ApiError
  >({
    queryKey: getvrackServicesReferenceZoneListQueryKey,
    queryFn: getvrackServicesReferenceZoneList,
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
        selectedZone,
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
            level2: '',
          });
          await queryClient.invalidateQueries({
            queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
          });
        } catch {
          await tracking.trackEvent({
            name: 'vrack-services::add::create-vrack-error',
            level2: '',
          });
        }
      }
      await queryClient.invalidateQueries({
        queryKey: getDeliveringOrderQueryKey(OrderDescription.vrackServices),
      });
      await tracking.trackEvent({
        name: 'vrack-services::add-success',
        level2: '',
      });
      navigate('/');
    },
    onError: async () => {
      await tracking.trackEvent({
        name: 'vrack-services::add-error',
        level2: '',
      });
    },
  });

  React.useEffect(() => {
    tracking.trackPage({
      name: 'vrack-services::add',
      level2: '',
    });
    queryClient.invalidateQueries({ queryKey: orderVrackQueryKey });
    queryClient.invalidateQueries({ queryKey: orderVrackServicesQueryKey });
  }, []);

  if (hasZoneError) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <CreatePageLayout
        createButtonLabel={t('createButtonLabel')}
        createButtonDataTracking={`vrack-services::add::${selectedZone}::confim`}
        formErrorMessage={t('creationServiceError', {
          error: vsCreationError?.response?.data.message,
          interpolation: { escapeValue: false },
        })}
        hasFormError={isCreationError}
        onSubmit={() => setIsModalVisible(true)}
        title={t('title')}
        isSubmitPending={isCreationPending}
        isFormSubmittable={!isZoneLoading && !!selectedZone}
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
        <ZoneFormField
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
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
