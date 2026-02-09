import { useState } from 'react';

import { useUpdateOkmsServiceKey } from '@key-management-service/data/hooks/useUpdateOkmsServiceKey';
import {
  ServiceKeyNameErrors,
  validateServiceKeyName,
} from '@key-management-service/utils/service-key/validateServiceKeyName';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  INPUT_TYPE,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOpenChangeDetail,
  Text,
} from '@ovhcloud/ods-react';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { Button, useNotifications } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { SERVICE_KEY_TEST_IDS } from '../dashboard/ServiceKeyDashboard.constants';

type EditServiceKeyNameModalProps = {
  initialName: string;
  okmsId: string;
  keyId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export const EditServiceKeyNameModal = ({
  initialName,
  okmsId,
  keyId,
  onClose,
  onSuccess,
}: EditServiceKeyNameModalProps) => {
  const [serviceKeyName, setServiceKeyName] = useState(initialName);

  const { addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { t: tCommon } = useTranslation('key-management-service/common');
  const { trackPage } = useOkmsTracking();

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
      onSuccess();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageTags: ['rename', 'service-key'],
      });
      onClose();
    },
  });

  const serviceKeyNameError = validateServiceKeyName(serviceKeyName);
  const serviceKeyNameErrorMessages: Record<ServiceKeyNameErrors, string> = {
    REQUIRED: t('key_management_service_service-keys_update_name_error_required'),
    INVALID_CHARACTERS: t(
      'key_management_service_service-keys_update_name_error_invalid_characters',
    ),
    TOO_MANY_CHARACTERS: t('key_management_service_service-keys_update_name_error_max'),
  };

  const handleClose = (detail: ModalOpenChangeDetail) => {
    if (!detail.open) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateKmsServiceKey({ name: serviceKeyName });
  };

  return (
    <Modal onOpenChange={handleClose} open>
      <ModalContent dismissible>
        <ModalHeader>
          <Text preset="heading-4">
            {t('key_management_service_service-keys_dashboard_field_name')}
          </Text>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <form onSubmit={handleSubmit}>
            <FormField invalid={!!serviceKeyNameError}>
              <Input
                disabled={isPending}
                className="w-full"
                name="input-edit-service-key-name"
                aria-label="input-edit-service-key-name"
                invalid={!!serviceKeyNameError}
                type={INPUT_TYPE.text}
                value={serviceKeyName}
                required
                onChange={(event) => {
                  setServiceKeyName(event.target.value);
                }}
              />
              {serviceKeyNameError && (
                <FormFieldError>{serviceKeyNameErrorMessages[serviceKeyNameError]}</FormFieldError>
              )}
            </FormField>
          </form>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="ghost" type="button">
              {tCommon('key_management_service_cancel')}
            </Button>
            <Button
              data-testid={SERVICE_KEY_TEST_IDS.modifyNameButton}
              onClick={() => updateKmsServiceKey({ name: serviceKeyName })}
              disabled={!!serviceKeyNameError || serviceKeyName === initialName}
              loading={isPending}
            >
              {tCommon('key_management_service_modify')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
