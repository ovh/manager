import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsSpinner,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useUpdateOkmsServiceKey } from '@/data/hooks/useUpdateOkmsServiceKey';
import Loading from '@/components/Loading/Loading';
import { useOkmsServiceKeyById } from '@/data/hooks/useOkmsServiceKeys';
import {
  ServiceKeyNameErrors,
  validateServiceKeyName,
} from '@/utils/serviceKey/validateServiceKeyName';
import { SERVICE_KEY_TEST_IDS } from '../dashboard/ServiceKeyDashboard.constants';

export const EditServiceKeyNameModal = () => {
  const { okmsId, keyId } = useParams() as {
    okmsId: string;
    keyId: string;
  };
  const { data, isLoading, error } = useOkmsServiceKeyById({ okmsId, keyId });
  const [serviceKeyName, setServiceKeyName] = useState(data?.data?.name || '');
  const serviceKeyNameError = validateServiceKeyName(serviceKeyName);
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('key-management-service/common');
  const { trackPage } = useOvhTracking();
  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  const { updateKmsServiceKey, isPending } = useUpdateOkmsServiceKey({
    okmsId,
    keyId,
    onSuccess: () => {
      clearNotifications();
      addSuccess(
        t('key_management_service_service-keys_update_name_success'),
        true,
      );
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'rename_encryption_key',
      });
      closeModal();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'rename_encryption_key',
      });
      closeModal();
    },
  });

  const getErrorMessage = (err: ServiceKeyNameErrors | undefined) => {
    switch (err) {
      case 'REQUIRED':
        return t(
          'key_management_service_service-keys_update_name_error_required',
        );
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_service-keys_update_name_error_invalid_characters',
        );
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_service-keys_update_name_error_max');

      default:
        return undefined;
    }
  };

  React.useEffect(() => {
    if (data?.data?.name) {
      setServiceKeyName(data?.data?.name);
    }
  }, [data]);

  if (error) return <div>{error.response.data.message}</div>;

  if (isLoading) return <Loading />;

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeModal}>
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('key_management_service_service-keys_dashboard_field_name')}
      </OdsText>
      {isPending ? (
        <OdsSpinner className="block my-3" size={ODS_SPINNER_SIZE.md} />
      ) : (
        <OdsFormField
          className="block my-3"
          error={getErrorMessage(serviceKeyNameError)}
        >
          <OdsInput
            className="w-full"
            name="input-edit-service-key-name"
            aria-label="input-edit-service-key-name"
            hasError={!!serviceKeyNameError}
            type={ODS_INPUT_TYPE.text}
            value={serviceKeyName}
            isRequired
            onOdsChange={(event) => {
              setServiceKeyName(event.target.value as string);
            }}
          />
        </OdsFormField>
      )}
      <OdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.outline}
        color={ODS_BUTTON_COLOR.primary}
        onClick={closeModal}
        label={tCommon('key_management_service_cancel')}
      />
      <OdsButton
        isLoading={isPending}
        isDisabled={
          !!serviceKeyNameError || serviceKeyName === data?.data?.name
        }
        slot="actions"
        data-testid={SERVICE_KEY_TEST_IDS.modifyNameButton}
        color={ODS_BUTTON_COLOR.primary}
        onClick={() => updateKmsServiceKey({ name: serviceKeyName })}
        aria-label="edit-name-okms"
        label={tCommon('key_management_service_modify')}
      />
    </OdsModal>
  );
};

export default EditServiceKeyNameModal;
