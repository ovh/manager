import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useOkmsServiceKeyById } from '@key-management-service/data/hooks/useOkmsServiceKeys';
import { useUpdateOkmsServiceKey } from '@key-management-service/data/hooks/useUpdateOkmsServiceKey';
import {
  ServiceKeyNameErrors,
  validateServiceKeyName,
} from '@key-management-service/utils/service-key/validateServiceKeyName';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import Loading from '@/common/components/loading/Loading';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { SERVICE_KEY_TEST_IDS } from '../dashboard/ServiceKeyDashboard.constants';

export const EditServiceKeyNameModal = () => {
  const { okmsId, keyId } = useRequiredParams('okmsId', 'keyId');
  const { data, isLoading, error } = useOkmsServiceKeyById({ okmsId, keyId });
  const [serviceKeyName, setServiceKeyName] = useState(data?.name || '');
  const serviceKeyNameError = validateServiceKeyName(serviceKeyName);
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('key-management-service/common');
  const { trackPage } = useOkmsTracking();
  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  const { updateKmsServiceKey, isPending } = useUpdateOkmsServiceKey({
    okmsId,
    keyId,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('key_management_service_service-keys_update_name_success'), true);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['rename', 'service-key'],
      });
      closeModal();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['rename', 'service-key'],
      });
      closeModal();
    },
  });

  const getErrorMessage = (err: ServiceKeyNameErrors | undefined) => {
    switch (err) {
      case 'REQUIRED':
        return t('key_management_service_service-keys_update_name_error_required');
      case 'INVALID_CHARACTERS':
        return t('key_management_service_service-keys_update_name_error_invalid_characters');
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_service-keys_update_name_error_max');

      default:
        return undefined;
    }
  };

  React.useEffect(() => {
    if (data?.name) {
      setServiceKeyName(data?.name);
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
        <OdsSpinner className="my-3 block" size={ODS_SPINNER_SIZE.md} />
      ) : (
        <OdsFormField className="my-3 block" error={getErrorMessage(serviceKeyNameError)}>
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
        isDisabled={!!serviceKeyNameError || serviceKeyName === data?.name}
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
