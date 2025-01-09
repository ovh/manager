import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import {
  OdsIcon,
  OdsPopover,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContainerCreationStore } from '../useContainerCreationStore';
import { ENCRYPTION_ALGORITHM_SSE_S3, NO_ENCRYPTION_VALUE } from '@/constants';

export function EncryptionStep() {
  const { t } = useTranslation(['containers/data-encryption', 'pci-common']);
  const {
    form,
    setEncryption,
    stepper,
    submitEncryption,
    editEncryption,
  } = useContainerCreationStore();
  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_data_encryption_title',
      )}
      isOpen={stepper.encryption.isOpen || stepper.encryption.isLocked}
      isChecked={stepper.encryption.isChecked}
      isLocked={stepper.encryption.isLocked}
      order={6}
      next={{
        action: submitEncryption,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editEncryption,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <>
        <p>
          <OdsText preset="paragraph">
            {t(
              'pci_projects_project_storages_containers_data_encryption_description',
            )}
          </OdsText>
        </p>
        <div className="flex mt-4">
          <OdsRadio
            className="mr-4"
            value={NO_ENCRYPTION_VALUE}
            name="encryption"
            inputId="encryption-none"
            onOdsChange={() => setEncryption(NO_ENCRYPTION_VALUE)}
          />
          <label htmlFor="encryption-none">
            {t(
              'pci_projects_project_storages_containers_data_encryption_plaintext',
            )}
          </label>
        </div>
        <div className="flex mt-4">
          <OdsRadio
            className="mr-4"
            value={ENCRYPTION_ALGORITHM_SSE_S3}
            name="encryption"
            inputId="encryption-sse-s3"
            isDisabled={form.region?.name === 'AP-SOUTH-MUM'}
            onOdsChange={() => setEncryption(ENCRYPTION_ALGORITHM_SSE_S3)}
          />
          <label htmlFor="encryption-sse-s3">
            {t(
              'pci_projects_project_storages_containers_data_encryption_aes256',
            )}
          </label>
          <span id="trigger-popover" className="ml-2">
            <OdsIcon name="circle-question" />
          </span>
          <OdsPopover triggerId="trigger-popover">
            {t(
              'pci_projects_project_storages_containers_data_encryption_aes256_tooltip',
            )}
          </OdsPopover>
        </div>
      </>
    </StepComponent>
  );
}
