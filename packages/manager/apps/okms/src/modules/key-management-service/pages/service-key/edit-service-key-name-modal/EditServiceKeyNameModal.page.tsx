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
  FormField,
  FormFieldError,
  INPUT_TYPE,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOpenChangeDetail,
  Text,
} from '@ovhcloud/ods-react';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { Button } from '@ovh-ux/muk';

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

  const handleClose = (detail: ModalOpenChangeDetail) => {
    if (!detail.open) {
      closeModal();
    }
  };

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
    <Modal onOpenChange={handleClose} open>
      <ModalContent dismissible>
        <ModalBody className="space-y-4">
          <Text preset="heading-3">
            {t('key_management_service_service-keys_dashboard_field_name')}
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateKmsServiceKey({ name: serviceKeyName });
            }}
          >
            <FormField className="my-3 block" invalid={!!serviceKeyNameError}>
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
              {getErrorMessage(serviceKeyNameError) && (
                <FormFieldError>{getErrorMessage(serviceKeyNameError)}</FormFieldError>
              )}
            </FormField>
          </form>
          <div className="flex justify-end gap-2">
            <Button variant="outline" color="primary" onClick={closeModal}>
              {tCommon('key_management_service_cancel')}
            </Button>
            <Button
              loading={isPending}
              disabled={!!serviceKeyNameError || serviceKeyName === data?.name}
              data-testid={SERVICE_KEY_TEST_IDS.modifyNameButton}
              color="primary"
              onClick={() => updateKmsServiceKey({ name: serviceKeyName })}
              aria-label="edit-name-okms"
            >
              {tCommon('key_management_service_modify')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditServiceKeyNameModal;
