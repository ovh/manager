import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import Modal from '@/components/Modal/Modal';

import { useUpdateOkmsServiceKey } from '@/data/hooks/useUpdateOkmsServiceKey';
import {
  ServiceKeyNameErrorsType,
  validateServiceKeyName,
} from '@/utils/serviceKey/validateServiceKeyName';

type ServiceKeyEditNameModalProps = {
  okmsId: string;
  keyId: string;
  name: string;
};

export const ServiceKeyEditNameModal = ({
  okmsId,
  keyId,
  name,
}: ServiceKeyEditNameModalProps) => {
  const [serviceKeyName, setServiceKeyName] = useState(name);
  const serviceKeyNameError = validateServiceKeyName(serviceKeyName);

  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('key-management-service/common');

  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  const { updateKmsServiceKey, isPending } = useUpdateOkmsServiceKey({
    okmsId,
    keyId,
    onSuccess: closeModal,
    onError: closeModal,
  });

  const getErrorMessage = (error: ServiceKeyNameErrorsType) => {
    switch (error) {
      case 'REQUIRED':
        return t(
          'key_management_service_service-keys_update_name_error_min_max',
        );

      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_service-keys_update_name_error_invalid_characters',
        );

      case 'TOO_MANY_CHARACTERS':
        return t(
          'key_management_service_service-keys_update_name_error_min_max',
        );

      default:
        return undefined;
    }
  };

  return (
    <Modal onClose={closeModal} color={ODS_THEME_COLOR_INTENT.primary}>
      {isPending ? (
        <div className="flex justify-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <OsdsFormField error={getErrorMessage(serviceKeyNameError)}>
          <span slot="label">
            <OsdsText>
              {t('key_management_service_service-keys_dashboard_field_name')}
            </OsdsText>
          </span>
          <OsdsInput
            aria-label="input-edit-service-key-name"
            error={!!serviceKeyNameError}
            type={ODS_INPUT_TYPE.text}
            value={serviceKeyName}
            required
            onOdsValueChange={(
              event: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
            ) => {
              setServiceKeyName(event.target.value as string);
            }}
          />
        </OsdsFormField>
      )}
      <OsdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          navigate('..');
        }}
      >
        {tCommon('key_management_service_cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={
          !!serviceKeyNameError ||
          isPending ||
          serviceKeyName === name ||
          undefined
        }
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => updateKmsServiceKey({ name: serviceKeyName })}
        aria-label="edit-name-okms"
      >
        {tCommon('key_management_service_modify')}
      </OsdsButton>
    </Modal>
  );
};
