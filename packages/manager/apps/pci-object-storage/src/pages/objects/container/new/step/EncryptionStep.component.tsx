import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import {
  OdsIcon,
  OdsPopover,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContainerCreationStore } from '../useContainerCreationStore';
import {
  ENCRYPTION_ALGORITHM_SSE_S3,
  MUMBAI_REGION_NAME,
  NO_ENCRYPTION_VALUE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
} from '@/constants';

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
      order={form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES ? 7 : 6}
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
        <OdsText preset="paragraph" className="block">
          {t(
            'pci_projects_project_storages_containers_data_encryption_description',
          )}
        </OdsText>

        <div className="flex flex-col gap-4 my-6">
          <div className="flex items-center gap-4">
            <OdsRadio
              value={NO_ENCRYPTION_VALUE}
              isChecked={form.encryption === NO_ENCRYPTION_VALUE}
              name="encryption"
              inputId="encryption-none"
              onOdsChange={() => setEncryption(NO_ENCRYPTION_VALUE)}
            />
            <label htmlFor="encryption-none">
              <OdsText>
                {t(
                  'pci_projects_project_storages_containers_data_encryption_plaintext',
                )}
              </OdsText>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <OdsRadio
              value={ENCRYPTION_ALGORITHM_SSE_S3}
              name="encryption"
              inputId="encryption-sse-s3"
              isDisabled={form.region?.name === MUMBAI_REGION_NAME}
              onOdsChange={() => setEncryption(ENCRYPTION_ALGORITHM_SSE_S3)}
            />
            <label htmlFor="encryption-sse-s3">
              <OdsText>
                {t(
                  'pci_projects_project_storages_containers_data_encryption_aes256',
                )}
              </OdsText>
            </label>
            <div>
              <OdsIcon
                id="trigger-popover"
                name="circle-question"
                className="text-[var(--ods-color-information-500)]"
              />
              <OdsPopover triggerId="trigger-popover">
                <OdsText preset="caption">
                  {t(
                    'pci_projects_project_storages_containers_data_encryption_aes256_tooltip',
                  )}
                </OdsText>
              </OdsPopover>
            </div>
          </div>
        </div>
      </>
    </StepComponent>
  );
}
