import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
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
import { useAuthentication } from '@ovh-ux/manager-react-core-application';
import { CountryCode } from '@ovh-ux/manager-config';
import {
  getvrackServicesReferenceZoneList,
  getvrackServicesReferenceZoneListQueryKey,
  orderVrackServices,
  orderVrackServicesQueryKey,
  orderVrack,
  orderVrackQueryKey,
  getDeliveringOrderQueryKey,
  OrderDescription,
  ResponseData,
  Zone,
} from '@/api';
import { BreadcrumbHandleParams } from '@/components/Breadcrumb';
import { ErrorPage } from '@/components/Error';
import { ZoneFormField } from './components/ZoneFormField';
import { CreatePageLayout } from '@/components/layout-helpers';
import { displayNameInputName } from './constants';
import { VrackConfirmModal } from './components/VrackConfirmModal';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

const CreationPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [shouldOrderVrack, setShouldOrderVrack] = React.useState(false);
  const { subsidiary } = useAuthentication();
  const { t } = useTranslation('vrack-services/create');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading: isZoneLoading, isError: hasZoneError, error } = useQuery<
    ResponseData<Zone[]>,
    ResponseData<Error>
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
  } = useMutation({
    mutationFn: () =>
      orderVrackServices({
        displayName,
        selectedZone,
        ovhSubsidiary: subsidiary as CountryCode,
      }),
    mutationKey: orderVrackServicesQueryKey,
    onSuccess: async () => {
      if (shouldOrderVrack) {
        await orderVrack({ ovhSubsidiary: subsidiary as CountryCode });
        queryClient.invalidateQueries({
          queryKey: getDeliveringOrderQueryKey(OrderDescription.vrack),
        });
      }
      queryClient.invalidateQueries({
        queryKey: getDeliveringOrderQueryKey(OrderDescription.vrackServices),
      });
      navigate('/', { replace: true });
    },
  });

  React.useEffect(() => {
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
        formErrorMessage={t('creationServiceError', { error: vsCreationError })}
        hasFormError={isCreationError}
        goBackLinkLabel={t('goBackLinkLabel')}
        goBackUrl="/"
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
