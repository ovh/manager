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
import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useAuthentication } from '@ovh-ux/manager-react-core-application';
import { CountryCode } from '@ovh-ux/manager-config/dist/types';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  getvrackServicesReferenceZoneList,
  getListingIcebergQueryKey,
  getvrackServicesReferenceZoneListQueryKey,
  orderVrackServices,
  orderVrackServicesQueryKey,
  orderVrack,
  orderVrackQueryKey,
} from '@/api';
import { BreadcrumbHandleParams } from '@/components/Breadcrumb';
import { ApiError, ErrorPage } from '@/components/Error';
import { ZoneFormField } from './ZoneFormField';
import { CreatePageLayout } from '@/components/layout-helpers';
import { displayNameInputName } from './constants';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

const CreationPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = React.useState('');
  const [displayName, setDisplayName] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { subsidiary } = useAuthentication();
  const { t } = useTranslation('vrack-services/create');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: zoneData,
    isLoading: isZoneLoading,
    isSuccess: isZoneFetched,
  } = useQuery({
    queryKey: getvrackServicesReferenceZoneListQueryKey,
    queryFn: getvrackServicesReferenceZoneList,
    staleTime: Infinity,
  });

  const {
    mutate: orderNewVrackServices,
    isLoading: isCreationPending,
    isError: isCreationError,
    isSuccess: isCreationSuccess,
  } = useMutation({
    mutationFn: () =>
      orderVrackServices({
        displayName,
        selectedZone,
        ovhSubsidiary: subsidiary as CountryCode,
      }),
    mutationKey: orderVrackServicesQueryKey,
  });

  const { mutate: orderNewVrack } = useMutation({
    mutationFn: () =>
      orderVrack({
        ovhSubsidiary: subsidiary as CountryCode,
      }),
    mutationKey: orderVrackQueryKey,
  });

  if (isZoneFetched && zoneData?.status !== 200) {
    return <ErrorPage error={(zoneData as unknown) as ApiError} />;
  }

  React.useEffect(() => {
    if (isCreationSuccess) {
      queryClient.invalidateQueries({ queryKey: getListingIcebergQueryKey });
      navigate('/', { replace: true });
    }
  });

  return (
    <>
      <CreatePageLayout
        createButtonLabel={t('createButtonLabel')}
        formErrorMessage={t('creationServiceError')}
        hasFormError={isCreationError}
        goBackLinkLabel={t('goBackLinkLabel')}
        goBackUrl="/"
        onSubmit={() => setIsModalVisible(true)}
        title={t('title')}
        isFormSubmittable={
          !isZoneLoading && !isCreationPending && !!selectedZone
        }
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
      <OsdsModal
        dismissible={undefined}
        headline="Voulez vous un vrack ?"
        masked={!isModalVisible || undefined}
      >
        test
        <OsdsButton
          slot="actions"
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            setIsModalVisible(false);
          }}
        >
          annuler
        </OsdsButton>
        <OsdsButton
          slot="actions"
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            orderNewVrackServices();
            setIsModalVisible(false);
          }}
        >
          non merci
        </OsdsButton>
        <OsdsButton
          slot="actions"
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={() => {
            orderNewVrack();
            orderNewVrackServices();
            setIsModalVisible(false);
          }}
        >
          accepter
        </OsdsButton>
      </OsdsModal>
    </>
  );
};

export default CreationPage;
