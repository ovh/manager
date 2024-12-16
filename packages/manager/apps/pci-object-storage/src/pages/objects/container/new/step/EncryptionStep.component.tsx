import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_SIZE,
  OdsRadioGroupValueChangeEventDetail,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContainerCreationStore } from '../useContainerCreationStore';

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
        'pci_projects_project_storages_containers_data_encryption_description',
      )}
      isOpen={stepper.encryption.isOpen || stepper.encryption.isLocked}
      isChecked={stepper.encryption.isChecked}
      isLocked={stepper.encryption.isLocked}
      order={5}
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
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._600}
          >
            {t(
              'pci_projects_project_storages_containers_data_encryption_description',
            )}
          </OsdsText>
        </p>
        <OsdsRadioGroup
          value={form.encryption}
          onOdsValueChange={(
            event: OsdsRadioGroupCustomEvent<
              OdsRadioGroupValueChangeEventDetail
            >,
          ) => {
            setEncryption(event.detail.newValue);
          }}
        >
          <OsdsRadio className="mt-4" value="plain">
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
            >
              <div slot="end" className="align-bottom inline-block">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._600}
                >
                  {t(
                    'pci_projects_project_storages_containers_data_encryption_plaintext',
                  )}
                </OsdsText>
              </div>
            </OsdsRadioButton>
          </OsdsRadio>
          <div className="flex">
            <OsdsRadio
              className="mt-4"
              value="aes256"
              disabled={form.region?.name === 'AP-SOUTH-MUM'}
            >
              <OsdsRadioButton
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_RADIO_BUTTON_SIZE.xs}
              >
                <div slot="end" className="align-bottom inline-block">
                  <OsdsText
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_TEXT_SIZE._600}
                  >
                    {t(
                      'pci_projects_project_storages_containers_data_encryption_aes256',
                    )}
                  </OsdsText>
                </div>
              </OsdsRadioButton>
            </OsdsRadio>
            <OsdsPopover className="w-4 h-4">
              <OsdsIcon
                slot="popover-trigger"
                name={ODS_ICON_NAME.HELP}
                size={ODS_ICON_SIZE.xxs}
                className="cursor-help ml-4 mt-4"
                color={ODS_THEME_COLOR_INTENT.text}
              />
              <OsdsPopoverContent>
                {t(
                  'pci_projects_project_storages_containers_data_encryption_aes256_tooltip',
                )}
              </OsdsPopoverContent>
            </OsdsPopover>
          </div>
        </OsdsRadioGroup>
      </>
    </StepComponent>
  );
}
