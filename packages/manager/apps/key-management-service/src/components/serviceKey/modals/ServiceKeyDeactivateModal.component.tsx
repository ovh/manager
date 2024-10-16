import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsButton,
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_SELECT_SIZE,
  ODS_SPINNER_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNotifications } from '@ovh-ux/manager-react-components';
import Modal from '@/components/Modal/Modal';

import { useUpdateOkmsServiceKey } from '@/data/hooks/useUpdateOkmsServiceKey';
import {
  OkmsServiceKeyDeactivationReason,
  OkmsServiceKeyDeactivationReasonTypes,
  OkmsServiceKeyPutState,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';

type ServiceKeyEditNameModalProps = {
  okmsId: string;
  keyId: string;
};

export const ServiceKeyDeactivateModal = ({
  okmsId,
  keyId,
}: ServiceKeyEditNameModalProps) => {
  const [deactivationReason, setDeactivationReason] = useState<
    OkmsServiceKeyDeactivationReason
  >();
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('key-management-service/common');

  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  const { updateKmsServiceKey, isPending } = useUpdateOkmsServiceKey({
    okmsId,
    keyId,
    onSuccess: () => {
      clearNotifications();
      addSuccess(
        t('key_management_service_service-keys_deactivation_success'),
        true,
      );
      closeModal();
    },
    onError: closeModal,
  });

  const onUpdateServiceKeyStatus = () => {
    let newState: OkmsServiceKeyPutState;
    switch (deactivationReason) {
      case 'AFFILIATION_CHANGED':
        newState = OkmsServiceKeyState.deactivated;
        break;

      case 'CA_COMPROMISE':
        newState = OkmsServiceKeyState.compromised;
        break;

      case 'CESSATION_OF_OPERATION':
        newState = OkmsServiceKeyState.deactivated;
        break;

      case 'KEY_COMPROMISE':
        newState = OkmsServiceKeyState.compromised;
        break;

      case 'PRIVILEGE_WITHDRAWN':
        newState = OkmsServiceKeyState.deactivated;
        break;

      case 'SUPERSEDED':
        newState = OkmsServiceKeyState.deactivated;
        break;

      case 'UNSPECIFIED':
        newState = OkmsServiceKeyState.deactivated;
        break;
      default:
        break;
    }
    updateKmsServiceKey({ state: newState, deactivationReason });
  };

  return (
    <Modal
      headline={t(
        'key_management_service_service-keys_modal_deactivation_heading',
      )}
      onClose={closeModal}
      color={ODS_THEME_COLOR_INTENT.warning}
    >
      {isPending ? (
        <div className="flex justify-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <OsdsFormField className="my-4">
          <OsdsSelect
            inline
            value={deactivationReason}
            onOdsValueChange={(e: OdsSelectValueChangeEvent) =>
              setDeactivationReason(
                e?.detail.value as OkmsServiceKeyDeactivationReason,
              )
            }
            size={ODS_SELECT_SIZE.md}
          >
            <span slot="placeholder">
              {t(
                'key_management_service_service-keys_modal_deactivation_reason_select_placeholder',
              )}
            </span>
            {OkmsServiceKeyDeactivationReasonTypes?.map((reason) => (
              <OsdsSelectOption key={reason} value={reason}>
                {t(
                  `key_management_service_service-keys_deactivation_reason_${reason.toLowerCase()}`,
                )}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
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
        disabled={!deactivationReason || isPending || undefined}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onUpdateServiceKeyStatus}
        aria-label="edit-name-okms"
      >
        {t('key_management_service_service-keys_deactivation_button_confirm')}
      </OsdsButton>
    </Modal>
  );
};
