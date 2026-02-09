import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useUpdateOkmsServiceKey } from '@key-management-service/data/hooks/useUpdateOkmsServiceKey';
import {
  OkmsServiceKeyDeactivationReason,
  OkmsServiceKeyDeactivationReasonTypes,
  OkmsServiceKeyPutState,
  OkmsServiceKeyState,
} from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOpenChangeDetail,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, PageType } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { Button } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

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
  const { okmsId, keyId } = useRequiredParams('okmsId', 'keyId');
  const [deactivationReason, setDeactivationReason] = useState<
    OkmsServiceKeyDeactivationReason | undefined
  >();
  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('key-management-service/common');
  const { trackClick, trackPage } = useOkmsTracking();
  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  const { updateKmsServiceKey, isPending } = useUpdateOkmsServiceKey({
    okmsId,
    keyId,
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('key_management_service_service-keys_deactivation_success'), true);
      trackPage({
        pageType: PageType.bannerSuccess,
        pageTags: ['deactivate', 'service-key'],
      });
      closeModal();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['deactivate', 'service-key'],
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

  const handleCancel = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['cancel'],
    });
    closeModal();
  };

  const handleClose = (detail: ModalOpenChangeDetail) => {
    if (!detail.open) {
      closeModal();
    }
  };

  return (
    <Modal onOpenChange={handleClose} open>
      <ModalContent color="warning" dismissible>
        <ModalHeader>
          <Text preset="heading-3">
            {t('key_management_service_service-keys_modal_deactivation_heading')}
          </Text>
        </ModalHeader>
        <ModalBody className="z-50 space-y-4 overflow-visible">
          <FormField className="my-4 block">
            <Select
              disabled={isPending}
              name="deactivation-reason"
              value={deactivationReason ? [deactivationReason] : []}
              onValueChange={(detail) =>
                setDeactivationReason(detail.value[0] as OkmsServiceKeyDeactivationReason)
              }
              items={OkmsServiceKeyDeactivationReasonTypes?.map((reason) => ({
                label: t(
                  `key_management_service_service-keys_deactivation_reason_${reason.toLowerCase()}`,
                ),
                value: reason,
              }))}
            >
              <SelectControl
                placeholder={t(
                  'key_management_service_service-keys_modal_deactivation_reason_select_placeholder',
                )}
              />
              <SelectContent createPortal={false} />
            </Select>
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="outline" color="critical" onClick={handleCancel}>
              {tCommon('key_management_service_cancel')}
            </Button>
            <Button
              loading={isPending}
              disabled={!deactivationReason}
              color="critical"
              onClick={handleSubmit}
              aria-label="edit-name-okms"
            >
              {t('key_management_service_service-keys_deactivation_button_confirm')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DisableServiceKeyModal;
