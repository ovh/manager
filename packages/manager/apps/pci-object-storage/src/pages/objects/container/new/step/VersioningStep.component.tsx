import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_SIZE,
  OdsRadioGroupValueChangeEventDetail,
  OsdsRadioGroupCustomEvent,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useContainerCreationStore } from '../useContainerCreationStore';

export function VersioningStep() {
  const { t } = useTranslation([
    'containers/bucket-versioning',
    'containers/enable-versioning',
    'pci-common',
  ]);
  const {
    form,
    setVersioning,
    stepper,
    submitVersioning,
    editVersioning,
  } = useContainerCreationStore();
  return (
    <StepComponent
      title={t(
        'pci_projects_project_storages_containers_bucket_versioning_title',
      )}
      isOpen={stepper.versioning.isOpen || stepper.versioning.isLocked}
      isChecked={stepper.versioning.isChecked}
      isLocked={stepper.versioning.isLocked}
      order={5}
      next={{
        action: submitVersioning,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: editVersioning,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <>
        <p>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
          >
            {t(
              'containers/enable-versioning:pci_projects_project_storages_containers_bucket_versioning_description',
            )}
          </OsdsText>
        </p>
        <OsdsRadioGroup
          value={form.versioning?.toString()}
          onOdsValueChange={(
            event: OsdsRadioGroupCustomEvent<
              OdsRadioGroupValueChangeEventDetail
            >,
          ) => {
            setVersioning(event.detail.newValue === 'true');
          }}
        >
          <OsdsRadio className="mt-4" value="false">
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
              checked={!form.versioning || undefined}
            >
              <div slot="end" className="align-bottom inline-block">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._400}
                >
                  {t(
                    'pci_projects_project_storages_containers_bucket_versioning_disabled',
                  )}
                </OsdsText>
              </div>
            </OsdsRadioButton>
          </OsdsRadio>
          <OsdsRadio className="mt-4" value="true">
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
              checked={form.versioning || undefined}
            >
              <div slot="end" className="align-bottom inline-block">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._400}
                >
                  {t(
                    'pci_projects_project_storages_containers_bucket_versioning_enabled',
                  )}
                </OsdsText>
              </div>
            </OsdsRadioButton>
          </OsdsRadio>
        </OsdsRadioGroup>
      </>
    </StepComponent>
  );
}
