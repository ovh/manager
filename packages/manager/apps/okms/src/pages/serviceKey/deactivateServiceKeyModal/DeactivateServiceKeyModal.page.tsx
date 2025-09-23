import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsFormField,
  OdsSelect,
  OdsSpinner,
  OdsText,
  OdsModal,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
  ODS_MODAL_COLOR,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useUpdateOkmsServiceKey } from '@/data/hooks/useUpdateOkmsServiceKey';
import {
  OkmsServiceKeyDeactivationReason,
  OkmsServiceKeyDeactivationReasonTypes,
  OkmsServiceKeyPutState,
  OkmsServiceKeyState,
} from '@/types/okmsServiceKey.type';

const stateByReason: {
  [deactivationReason: string]: OkmsServiceKeyPutState;
} = {
  AFFILIATION_CHANGED: OkmsServiceKeyState.deactivated,
  CA_COMPROMISE: OkmsServiceKeyState.compromised,
  CESSATION_OF_OPERATION: OkmsServiceKeyState.deactivated,
  KEY_COMPROMISE: OkmsServiceKeyState.compromised,
  PRIVILEGE_WITHDRAWN: OkmsServiceKeyState.deactivated,
  SUPERSEDED: OkmsServiceKeyState.deactivated,
  UNSPECIFIED: OkmsServiceKeyState.deactivated,
};

export const DisableServiceKeyModal = () => {
  const { okmsId, keyId } = useParams() as {
    okmsId: string;
    keyId: string;
  };
  const [deactivationReason, setDeactivationReason] = useState<
    OkmsServiceKeyDeactivationReason | undefined
  >();
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('key-management-service/common');
  const { trackClick, trackPage } = useOvhTracking();
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
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'deactivate_encryption_key',
      });
      closeModal();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'deactivate_encryption_key',
      });
      closeModal();
    },
  });

  const handleSubmit = () => {
    if (!deactivationReason) {
      return;
    }

    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['confirm'],
    });

    updateKmsServiceKey({
      state: stateByReason[deactivationReason],
      deactivationReason,
    });
  };

  return (
    <OdsModal
      isOpen
      isDismissible
      onOdsClose={closeModal}
      color={ODS_MODAL_COLOR.warning}
      className="[&::part(dialog)]:overflow-visible [&::part(dialog-content)]:overflow-visible"
    >
      <OdsText preset={ODS_TEXT_PRESET.heading2}>
        {t('key_management_service_service-keys_modal_deactivation_heading')}
      </OdsText>
      {isPending ? (
        <OdsSpinner className="block my-4" size={ODS_SPINNER_SIZE.md} />
      ) : (
        <OdsFormField className="block my-4">
          <OdsSelect
            name="deactivation-reason"
            value={deactivationReason}
            onOdsChange={(e) =>
              setDeactivationReason(
                e?.detail.value as OkmsServiceKeyDeactivationReason,
              )
            }
            placeholder={t(
              'key_management_service_service-keys_modal_deactivation_reason_select_placeholder',
            )}
          >
            {OkmsServiceKeyDeactivationReasonTypes?.map((reason) => (
              <option key={reason} value={reason}>
                {t(
                  `key_management_service_service-keys_deactivation_reason_${reason.toLowerCase()}`,
                )}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
      )}
      <OdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.outline}
        color={ODS_BUTTON_COLOR.primary}
        onClick={() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['cancel'],
          });
          closeModal();
        }}
        label={tCommon('key_management_service_cancel')}
      />
      <OdsButton
        isLoading={isPending}
        isDisabled={!deactivationReason}
        slot="actions"
        color={ODS_BUTTON_COLOR.primary}
        onClick={handleSubmit}
        aria-label="edit-name-okms"
        label={t(
          'key_management_service_service-keys_deactivation_button_confirm',
        )}
      />
    </OdsModal>
  );
};

export default DisableServiceKeyModal;
